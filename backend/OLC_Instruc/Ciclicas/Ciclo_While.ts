import { listaErrores } from '../../indexControllers';
import { Instruccion } from '../../OLC_Abs/Instruccion';
import Nodo from '../../OLC_Abs/Nodo_AST';
import Errores from '../../OLC_Excep/Errores';
import Arbol from '../../OLC_Simb/Simbolo_Arbol';
import tablaSimbolos from '../../OLC_Simb/Simbolo_TablaSimbolos';
import Tipo, { tipoDato } from '../../OLC_Simb/Simbolo_Tipo';
import Return from '../Instruccion_Return';

export default class condWhile extends Instruccion {
  //variables de condicion y expresion
  private condicion: Instruccion;
  private expresion: Instruccion[];
  //el meotodo constructor 
  constructor(
    condicion: Instruccion,
    expresion: Instruccion[],
    fila: number,
    columna: number
  ) {
    super(new Tipo(tipoDato.ENTERO), fila, columna);
    this.condicion = condicion;
    this.expresion = expresion;
  }
 

  //para analizar los valores ingresados
  public interpretar(arbol: Arbol, tabla: tablaSimbolos) {
    let val = this.condicion.interpretar(arbol, tabla);
    if (val instanceof Errores) return val;
    if (this.condicion.tipoDato.getTipo() != tipoDato.BOOLEANO) {
      return new Errores(
        'SEMANTICO',
        'DATO DEBE SER BOOLEANO',
        this.fila,
        this.columna
      );
    }
    while (this.condicion.interpretar(arbol, tabla)) {
      let nuevaTabla = new tablaSimbolos(tabla);
      nuevaTabla.setNombre('While');
      for (let i = 0; i < this.expresion.length; i++) {
        let a = this.expresion[i].interpretar(arbol, nuevaTabla);
        if (a instanceof Errores) {
          listaErrores.push(a);
          arbol.actualizaConsola((<Errores>a).returnError());
        }
        if (a instanceof Return) return a;
        if (a == 'ByLyContinue') break;
        if (a == 'ByLy23') return;
      }
    }
  }

   //para obtener nodo
   public getNodo(): Nodo {
    let nodo = new Nodo('DO_WHILE');
    nodo.agregarHijo('while');
    nodo.agregarHijo('(');
    nodo.agregarHijoAST(this.condicion.getNodo());
    nodo.agregarHijo(')');
    nodo.agregarHijo('{');
    this.expresion.forEach((element) => {
      nodo.agregarHijoAST(element.getNodo());
    });
    nodo.agregarHijo('}');
    return nodo;
  }
}
