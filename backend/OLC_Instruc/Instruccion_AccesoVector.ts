import { Instruccion } from '../OLC_Abs/Instruccion';
import Nodo from '../OLC_Abs/Nodo_AST';
import Errores from '../OLC_Excep/Errores';
import Arbol from '../OLC_Simb/Simbolo_Arbol';
import tablaSimbolos from '../OLC_Simb/Simbolo_TablaSimbolos';
import Tipo, { tipoDato } from '../OLC_Simb/Simbolo_Tipo';

export default class accesoVector extends Instruccion {
  //variables de identificador y expresion
  private identificador: string;
  private expresion: Instruccion;

  //el metodo constructor
  constructor(
    identificador: string,
    expresion: Instruccion,
    fila: number,
    columna: number
  ) {
    super(new Tipo(tipoDato.ENTERO), fila, columna);
    this.identificador = identificador.toLowerCase();
    this.expresion = expresion;
  }
 

  //para analizar los valores ingresados
  public interpretar(arbol: Arbol, tabla: tablaSimbolos) {
    let exp = this.expresion.interpretar(arbol, tabla);
    if (exp instanceof Errores) return exp;
    if (this.expresion.tipoDato.getTipo() != tipoDato.ENTERO)
      return new Errores(
        'SEMANTICO',
        'TIPO DE DATO DIFERENTE',
        this.fila,
        this.columna
      );
    let ide = tabla.getVariable(this.identificador);

    if (ide != null) {
      this.tipoDato = new Tipo(ide.gettipo().getTipo());
      return ide.getvalor()[exp];
    }
    return null;
  }

   //para obtener nodo
   public getNodo() {
    let nodo = new Nodo('ACCESO-VECTOR');
    nodo.agregarHijo(this.identificador);
    nodo.agregarHijo('[');
    nodo.agregarHijoAST(this.expresion.getNodo());
    nodo.agregarHijo(']');
    return nodo;
  }
}
