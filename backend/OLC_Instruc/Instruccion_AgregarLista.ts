import { Instruccion } from '../OLC_Abs/Instruccion';
import Nodo from '../OLC_Abs/Nodo_AST';
import Errores from '../OLC_Excep/Errores';
import Arbol from '../OLC_Simb/Simbolo_Arbol';
import tablaSimbolos from '../OLC_Simb/Simbolo_TablaSimbolos';
import Tipo, { tipoDato } from '../OLC_Simb/Simbolo_Tipo';

export default class agregarLista extends Instruccion {

  //variables para identificador y expresion
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
    let ide = tabla.getVariable(this.identificador);
    if (ide != null) {
      let arreglo = ide.getvalor();
      let exp = this.expresion.interpretar(arbol, tabla);
      if (exp instanceof Errores) return exp;
      if (ide.gettipo().getTipo() != this.expresion.tipoDato.getTipo())
        return new Errores(
          'SEMANTICO',
          'VARIABLE ' + this.identificador + ' TIPOS DE DATOS DIFERENTES',
          this.fila,
          this.columna
        );
      arreglo.push(exp);
      ide.setvalor(arreglo);
      arbol.actualizarTabla(
        this.identificador,
        arreglo,
        this.fila.toString(),
        tabla.getNombre().toString(),
        this.columna.toString()
      );
    } else
      return new Errores(
        'SEMANTICO',
        `VARIABLE ${this.identificador} NO EXISTE`,
        this.fila,
        this.columna
      );
  }

   //para obtener nodo
   public getNodo() {
    let nodo = new Nodo('ADD-LISTA');
    nodo.agregarHijo(this.identificador);
    nodo.agregarHijo('.');
    nodo.agregarHijo('add');
    nodo.agregarHijo('(');
    nodo.agregarHijoAST(this.expresion.getNodo());
    nodo.agregarHijo(')');
    nodo.agregarHijo(';');
    return nodo;
  }

}
