import { Instruccion } from '../OLC_Abs/Instruccion';
import Nodo from '../OLC_Abs/Nodo_AST';
import Errores from '../OLC_Excep/Errores';
import Arbol from '../OLC_Simb/Simbolo_Arbol';
import tablaSimbolos from '../OLC_Simb/Simbolo_TablaSimbolos';
import Tipo, { tipoDato } from '../OLC_Simb/Simbolo_Tipo';

export default class Println extends Instruccion {
  //variables para la instruccion print pero con salto de línea
  private expresion: Instruccion;

  //el metodo constructor
  constructor(expresion: Instruccion, fila: number, columna: number) {
    super(new Tipo(tipoDato.CADENA), fila, columna);
    this.expresion = expresion;
  }

   //metodo para analizar los valores ingresados
   public interpretar(arbol: Arbol, tabla: tablaSimbolos) {
    let valor = this.expresion.interpretar(arbol, tabla);
    if (valor instanceof Errores) return valor;
    arbol.actualizaConsola(valor + '');
  }

  //metodo para obtener un nodo
  public getNodo(): Nodo {
    let nodo = new Nodo('IMPRESION');
    nodo.agregarHijo('println');
    nodo.agregarHijo('(');
    nodo.agregarHijoAST(this.expresion.getNodo());
    nodo.agregarHijo(')');
    nodo.agregarHijo(';');
    return nodo;
  }

 
}