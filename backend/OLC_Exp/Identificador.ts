import { Instruccion } from '../OLC_Abs/Instruccion';
import Nodo from '../OLC_Abs/Nodo_AST';
import Errores from '../OLC_Excep/Errores';
import Arbol from '../OLC_Simb/Simbolo_Arbol';
import tablaSimbolos from '../OLC_Simb/Simbolo_TablaSimbolos';
import Tipo, { tipoDato } from '../OLC_Simb/Simbolo_Tipo';

export default class Identificador extends Instruccion {
  public identificador: String; // variable que almacena el identificador
  //metodo constructor
  constructor(identificador: String, fila: number, columna: number) {
    super(new Tipo(tipoDato.ENTERO), fila, columna);
    this.identificador = identificador.toLowerCase();
  }

  //meotodo para validar los simbolos, si es así se agrega 
  public interpretar(arbol: Arbol, tabla: tablaSimbolos) {
  let variable = tabla.getVariable(this.identificador); // obgento el identificador

  if (variable != null) {// valido si no viene vacia
    this.tipoDato = variable.gettipo();
    return variable.getvalor();
  } else {
    return new Errores(
      'SEMANTICO',
      'VARIABLE ' + this.identificador + ' NO EXISTE',
      this.fila,
      this.columna
    );
  }
}
  //metodo para obtener el nodo, para consulta
  public getNodo(): Nodo {
    let nodo = new Nodo('IDENTIFICADOR');
    nodo.agregarHijo(this.identificador + '');
    return nodo;
  }
  
}
