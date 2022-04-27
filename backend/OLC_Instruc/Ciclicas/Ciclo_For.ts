import { listaErrores } from '../../indexControllers';
import { Instruccion } from '../../OLC_Abs/Instruccion';
import Nodo from '../../OLC_Abs/Nodo_AST';
import Errores from '../../OLC_Excep/Errores';
import Arbol from '../../OLC_Simb/Simbolo_Arbol';
import tablaSimbolos from '../../OLC_Simb/Simbolo_TablaSimbolos';
import Tipo, { tipoDato } from '../../OLC_Simb/Simbolo_Tipo';
import Return from '../Instruccion_Return';

export default class condFor extends Instruccion {
  //variables para declaracion, condicion
  private Asignacion: Instruccion;
  private condicion: Instruccion;
  private actualizacion: Instruccion;
  private instrucciones: Instruccion[];

  //el metodo constructor
  constructor(
    declasignacion: Instruccion,
    condicion: Instruccion,
    actualizacion: Instruccion,
    instrucciones: Instruccion[],
    fila: number,
    columna: number
  ) {
    super(new Tipo(tipoDato.ENTERO), fila, columna);
    this.Asignacion = declasignacion;
    this.actualizacion = actualizacion;
    this.condicion = condicion;
    this.instrucciones = instrucciones;
  }

 
  //analizar valor ingresado
  public interpretar(arbol: Arbol, tabla: tablaSimbolos) {
    let nuevaTabla = new tablaSimbolos(tabla);
    nuevaTabla.setNombre('For');
    let declaAsig = this.Asignacion.interpretar(arbol, nuevaTabla);
    if (declaAsig instanceof Errores) return declaAsig;
    let val = this.condicion.interpretar(arbol, nuevaTabla);
    if (val instanceof Errores) return val;
    if (this.condicion.tipoDato.getTipo() != tipoDato.BOOLEANO) {
      return new Errores(
        'SEMANTICO',
        'DATO DEBE SER BOOLEANO',
        this.fila,
        this.columna
      );
    }
    while (this.condicion.interpretar(arbol, nuevaTabla)) {
      let otraTabla = new tablaSimbolos(nuevaTabla);
      otraTabla.setNombre('ForDentro');
      for (let i = 0; i < this.instrucciones.length; i++) {
        let a = this.instrucciones[i].interpretar(arbol, otraTabla);
        if (a instanceof Errores) {
          listaErrores.push(a);
          arbol.actualizaConsola((<Errores>a).returnError());
        }
        if (a instanceof Return) return a;
        if (a == 'ByLyContinue') break;
        if (a == 'ByLy23') return;
      }
      let valActualizacion = this.actualizacion.interpretar(arbol, nuevaTabla);
      if (valActualizacion instanceof Errores) return valActualizacion;
    }
  }

   //para obtener nodo
   public getNodo(): Nodo {
    let nodo = new Nodo('FOR');
    nodo.agregarHijo('for');
    nodo.agregarHijo('(');
    nodo.agregarHijoAST(this.Asignacion.getNodo());
    nodo.agregarHijo(';');
    nodo.agregarHijoAST(this.condicion.getNodo());
    nodo.agregarHijo(';');
    nodo.agregarHijoAST(this.actualizacion.getNodo());
    nodo.agregarHijo(')');
    nodo.agregarHijo('{');
    this.instrucciones.forEach((element) => {
      nodo.agregarHijoAST(element.getNodo());
    });
    nodo.agregarHijo('}');
    return nodo;
  }
}
