import { Instruccion } from '../OLC_Abs/Instruccion';
import Nodo from '../OLC_Abs/Nodo_AST';
import Arbol from '../OLC_Simb/Simbolo_Arbol';
import tablaSimbolos from '../OLC_Simb/Simbolo_TablaSimbolos';
import Tipo, { tipoDato } from '../OLC_Simb/Simbolo_Tipo';

export default class Return extends Instruccion {
  //variable para la instruccion return
  private expresionReturn?: Instruccion; // puede o no venir en un metodo o funcion
  public valor = null; // al principio es nulo

  //el metodo constructor
  constructor(fila: number, columna: number, expresion?: Instruccion) {
    super(new Tipo(tipoDato.ENTERO), fila, columna);
    this.expresionReturn = expresion;
  }

  //para analizar los valores ingresados
  public interpretar(arbol: Arbol, tabla: tablaSimbolos) {
    if (this.expresionReturn) {
      this.valor = this.expresionReturn?.interpretar(arbol, tabla);
      this.tipoDato = this.expresionReturn.tipoDato;
    }
    return this;
  }
  //para obtener un nodo
  public getNodo(): Nodo {
    let nodo = new Nodo('RETURN');
    nodo.agregarHijo('return');
    if (this.expresionReturn != undefined) {
      nodo.agregarHijoAST(this.expresionReturn.getNodo());
    }
    nodo.agregarHijo(';');
    return nodo;
  }

  
}
