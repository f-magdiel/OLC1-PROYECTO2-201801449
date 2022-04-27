import { Instruccion } from '../OLC_Abs/Instruccion';
import Nodo from '../OLC_Abs/Nodo_AST';
import Arbol from '../OLC_Simb/Simbolo_Arbol';
import tablaSimbolos from '../OLC_Simb/Simbolo_TablaSimbolos';
import Tipo, { tipoDato } from '../OLC_Simb/Simbolo_Tipo';

export default class Nativo extends Instruccion {
  valor: any;// que puede recibir cualquier tipo de datos
  
  //el metodo constructor
  constructor(tipo: Tipo, valor: any, fila: number, columna: number) {
    super(tipo, fila, columna);
    this.valor = valor;
    if (tipo.getTipo() == tipoDato.CADENA) {
      let val = this.valor.toString();
      this.valor = val
        .replace('\\n', '\n')
        .replace('\\t', '\t')
        .replace('\\r', '\r')
        .replace('\\\\', '\\')
        .replace("\\'", "'")
        .replace('\\"', '"');
    }
  }

  //metodo para analizar el simbolo ingresado
  interpretar(arbol: Arbol, tabla: tablaSimbolos) {
    if (this.tipoDato.getTipo() == tipoDato.BOOLEANO) {
      return this.valor == 'true' ? true : false;
    }
    return this.valor;
  }

   //metodo para obtener el Nodo
   public getNodo(): Nodo {
    let nodo = new Nodo('NATIVO');
    nodo.agregarHijo(this.valor + '');
    return nodo;
  }

}
