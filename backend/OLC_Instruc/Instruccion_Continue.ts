import { Instruccion } from '../OLC_Abs/Instruccion';
import Nodo from '../OLC_Abs/Nodo_AST';
import Arbol from '../OLC_Simb/Simbolo_Arbol';
import tablaSimbolos from '../OLC_Simb/Simbolo_TablaSimbolos';
import Tipo, { tipoDato } from '../OLC_Simb/Simbolo_Tipo';

export default class Continue extends Instruccion {
  //el metodo constructor
  constructor(fila: number, columna: number) {
    super(new Tipo(tipoDato.ENTERO), fila, columna);
  }

  //para obtener un nodo
  public getNodo(): Nodo {
    let nodo = new Nodo('CONTINUE');
    nodo.agregarHijo('continue');
    nodo.agregarHijo(';');
    return nodo;
  }

  //para retornar un palabra reservada
  public interpretar(arbol: Arbol, tabla: tablaSimbolos) {
    return 'ByLyContinue';
  }
}
