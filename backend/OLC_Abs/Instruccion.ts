import Arbol from '../OLC_Simb/Simbolo_Arbol';
import tablaSimbolos from '../OLC_Simb/Simbolo_TablaSimbolos';
import Tipo from '../OLC_Simb/Simbolo_Tipo';
import nodoAST from './Nodo_AST';
export abstract class Instruccion {// para reciclar codigo, así hereda de esta clase
  // los tipos de datos a utilizar
  public tipoDato: Tipo;
  public fila: number;
  public columna: number;

  //metodo constructor
  constructor(tipo: Tipo, fila: number, columna: number) {
    this.tipoDato = tipo;
    this.fila = fila;
    this.columna = columna;
  }

  //clases heredadas
  abstract interpretar(arbol: Arbol, tabla: tablaSimbolos): any;
  abstract getNodo(): nodoAST;
}
