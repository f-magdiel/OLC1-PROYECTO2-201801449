import { Request, Response } from 'express';
import nodoAST from './OLC_Abs/Nodo_AST';
import Errores from './OLC_Excep/Errores';
import Asignacion from './OLC_Instruc/Instruccion_Asignacion';
import Declaracion from './OLC_Instruc/Instruccion_Declaracion';
import declaracionVectores from './OLC_Instruc/Instruccion_DeclaracionVectores';
import declaracionListas from './OLC_Instruc/Instruccion_DeclaracionListas';
import Exec from './OLC_Instruc/Instruccion_Run';
import Funciones from './OLC_Instruc/Instruccion_Funciones';
import Metodos from './OLC_Instruc/Instruccion_Metodos';
import Arbol from './OLC_Simb/Simbolo_Arbol';
import tablaSimbolos from './OLC_Simb/Simbolo_TablaSimbolos';
import graficarArbol from './OLC_Rep/Reporte_Graficar';
import asignacionVector from './OLC_Instruc/Instruccion_AsignacionVector';
import asignacionLista  from './OLC_Instruc/Instruccion_AsignacionLista';
import agregarLista from './OLC_Instruc/Instruccion_AgregarLista';
import { reporteTabla } from './OLC_Rep/Reporte_ReporteTabla';

//variables que son de tipo global para su uso posterior
export let listaErrores: Array<Errores>;
let tablaSym: Array<reporteTabla>;
tablaSym = new Array<reporteTabla>();
let arbolNuevo: Arbol;
let contador: number;
let cuerpo: string;

class IndexController {
  

  //metodo para analizar todo el codigo ingresado y responder con un respuesta
  //para realizar peticiones al backend
  public interpretar(req: Request, res: Response) {
    listaErrores = new Array<Errores>();
    let parser = require('./OLC_Gramm/analizador');
    const { entrada } = req.body;
    const exp2=req.body.exp
    
    
      let ast = new Arbol(parser.parse(exp2));
      var tabla = new tablaSimbolos();
      ast.settablaGlobal(tabla);
      for (let i of ast.getinstrucciones()) {
        if (i instanceof Metodos || i instanceof Funciones) {
          ast.getfunciones().push(i);
        }
      }

      for (let i of ast.getinstrucciones()) {
        if (i instanceof Errores) {
          listaErrores.push(i);
          ast.actualizaConsola((<Errores>i).returnError());
        }
        if (i instanceof Metodos || i instanceof Funciones || i instanceof Exec)
          continue;
        if (
          i instanceof Declaracion ||
          i instanceof Asignacion ||
          i instanceof declaracionVectores ||
          i instanceof declaracionListas ||
          i instanceof asignacionVector ||
          i instanceof asignacionLista ||
          i instanceof agregarLista
        ) {
          var resultador = i.interpretar(ast, tabla);
          if (resultador instanceof Errores) {
            listaErrores.push(resultador);
            ast.actualizaConsola((<Errores>resultador).returnError());
          }
        } else {
          let error = new Errores(
            'SEMANTICO',
            'SENTENCIA FUERA DE METODO',
            i.fila,
            i.columna
          );
          listaErrores.push(error);
          ast.actualizaConsola((<Errores>error).returnError());
        }
      }
      for (let i of ast.getinstrucciones()) {
        if (i instanceof Exec) {
          var resultador = i.interpretar(ast, tabla);
          if (resultador instanceof Errores) {
            listaErrores.push(resultador);
            ast.actualizaConsola((<Errores>resultador).returnError());
          }
        }
      }
      arbolNuevo = ast;
      tablaSym.length = 0 // lo vacio
     for (let i of ast.getSimbolos()){
       console.log("tabla")
       console.log(i)
       tablaSym.push(i)
     }
     // retorno el resultado, array de errores y de simbolos
      return res.send({
        resultado: ast.getconsola(),
        errores: listaErrores,
        tabla: ast.getSimbolos(),
      });
      
  }

  //metodo para graficar cuando se hace la peticion desde el front
  public graficar(req: Request, res: Response) {
    let otro = arbolNuevo;
    if (otro == null) return res.json({ msg: false });
    
    let arbolAst = new nodoAST('RAIZ');
    let nodoINS = new nodoAST('INSTRUCCIONES');
    otro.getinstrucciones().forEach((element) => {
      nodoINS.agregarHijoAST(element.getNodo());
    });
    arbolAst.agregarHijoAST(nodoINS);
    graficarArbol(<nodoAST>arbolAst);
    return res.json({ msg: true });
  }

  //metodo para deolver el array de errores cuando se hace la peticion desde el front
  public consultaerror(req:Request,res:Response){
    
    return res.send({
      errores: listaErrores
    })
  }
 
  //meotodo para devolver el array de tabla de simbolos cuando se hace la peticion desde el front
  public consultatabla(req:Request,res:Response){

    return res.send({
      tabla: tablaSym
    })
  }
}
export const indexController = new IndexController();
