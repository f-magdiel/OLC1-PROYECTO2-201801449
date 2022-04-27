import { Instruccion } from '../OLC_Abs/Instruccion';
import Nodo from '../OLC_Abs/Nodo_AST';
import Arbol from '../OLC_Simb/Simbolo_Arbol';
import tablaSimbolos from '../OLC_Simb/Simbolo_TablaSimbolos';
import Tipo, { tipoDato } from '../OLC_Simb/Simbolo_Tipo';

export default class Break extends Instruccion {
  //el metodo constructor
  constructor(fila: number, columna: number) {
    super(new Tipo(tipoDato.ENTERO), fila, columna);
  }
  //para analizar los dalos ingresados
  public interpretar(arbol: Arbol, tabla: tablaSimbolos) {
  return 'ByLy23';
  }
  //para analiazar un nodo
  public getNodo(): Nodo {
    let nodo = new Nodo('BREAK');
    nodo.agregarHijo('break');
    nodo.agregarHijo(';');
    return nodo;
  }
  
}
