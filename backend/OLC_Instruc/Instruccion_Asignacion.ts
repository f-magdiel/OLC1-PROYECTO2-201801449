import { Instruccion } from '../OLC_Abs/Instruccion';
import Nodo from '../OLC_Abs/Nodo_AST';
import Errores from '../OLC_Excep/Errores';
import Arbol from '../OLC_Simb/Simbolo_Arbol';
import tablaSimbolos from '../OLC_Simb/Simbolo_TablaSimbolos';
import Tipo, { tipoDato } from '../OLC_Simb/Simbolo_Tipo';

export default class Asignacion extends Instruccion {
  //variables para identificador e instruccion
  private identificador: string;
  private valor: Instruccion;

  //el metodo constructor
  constructor(
    identificador: string,
    valor: Instruccion,
    fila: number,
    columna: number
  ) {
    super(new Tipo(tipoDato.ENTERO), fila, columna);
    this.identificador = identificador.toLowerCase();
    this.valor = valor;
  }


  //para analizador los valores ingresados
  public interpretar(arbol: Arbol, tabla: tablaSimbolos) {
    //tomar el tipoDato de la variable
    let variable = tabla.getVariable(this.identificador);
    if (variable != null) {
      let val = this.valor.interpretar(arbol, tabla);
      if (variable.gettipo().getTipo() != this.valor.tipoDato.getTipo()) {
        return new Errores(
          'SEMANTICO',
          'VARIABLE ' + this.identificador + ' TIPOS DE DATOS DIFERENTES',
          this.fila,
          this.columna
        );
      } else {
        variable.setvalor(val);
        arbol.actualizarTabla(
          this.identificador,
          variable.getvalor(),
          this.fila.toString(),
          tabla.getNombre().toString(),
          this.columna.toString()
        );
       
      }
    } else {
      console.log(this.identificador);
      return new Errores(
        'SEMANTICO',
        'VARIABLE ' + this.identificador + ' NO EXISTE',
        this.fila,
        this.columna
      );
    }
  }
    //para obtener Nodo
    public getNodo(): Nodo {
      let nodo = new Nodo('ASIGNACION');
      nodo.agregarHijo(this.identificador);
      nodo.agregarHijo('=');
      nodo.agregarHijoAST(this.valor.getNodo());
      nodo.agregarHijo(';');
      return nodo;
    }
}
