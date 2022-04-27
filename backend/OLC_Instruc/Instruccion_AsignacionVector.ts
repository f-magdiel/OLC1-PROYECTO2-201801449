import { Instruccion } from '../OLC_Abs/Instruccion';
import Nodo from '../OLC_Abs/Nodo_AST';
import Errores from '../OLC_Excep/Errores';
import Arbol from '../OLC_Simb/Simbolo_Arbol';
import tablaSimbolos from '../OLC_Simb/Simbolo_TablaSimbolos';
import Tipo, { tipoDato } from '../OLC_Simb/Simbolo_Tipo';

export default class asignacionVector extends Instruccion {
  //variables para indentificador e instrucciones
  private identificador: string;
  private posicion: Instruccion;
  private expresion: Instruccion;

  //el metodo constructor
  constructor(
    identificador: string,
    posicion: Instruccion,
    expresion: Instruccion,
    fila: number,
    columna: number
  ) {
    super(new Tipo(tipoDato.ENTERO), fila, columna);
    this.identificador = identificador.toLowerCase();
    this.posicion = posicion;
    this.expresion = expresion;
  }

 
  //para analizar los valores ingresados
  public interpretar(arbol: Arbol, tabla: tablaSimbolos) {
    let ide = tabla.getVariable(this.identificador);
    if (ide != null) {
      let pos = this.posicion.interpretar(arbol, tabla);
      if (pos instanceof Errores) return pos;
      if (this.posicion.tipoDato.getTipo() != tipoDato.ENTERO)
        return new Errores(
          'SEMANTICO',
          'TIPO DE DATO NO NUMERICO',
          this.fila,
          this.columna
        );
      let arreglo = ide.getvalor();
      if (pos > arreglo.length)
        return new Errores(
          'SEMANTICO',
          'RANGO FUERA DE LOS LIMITES',
          this.fila,
          this.columna
        );
      let exp = this.expresion.interpretar(arbol, tabla);
      if (exp instanceof Errores) return exp;
      if (ide.gettipo().getTipo() != this.expresion.tipoDato.getTipo())
        return new Errores(
          'SEMANTICO',
          'VARIABLE ' + this.identificador + ' TIPOS DE DATOS DIFERENTES',
          this.fila,
          this.columna
        );
      arreglo[pos] = exp;
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

   //para obtener un nodo
   public getNodo() {
    let nodo = new Nodo('ASIGNACION-VECTOR');
    //ejemplo ah[0]= "eje";
    nodo.agregarHijo(this.identificador);
    nodo.agregarHijo('[');
    nodo.agregarHijoAST(this.posicion.getNodo());
    nodo.agregarHijo(']');
    nodo.agregarHijo('=');
    nodo.agregarHijoAST(this.expresion.getNodo());
    nodo.agregarHijo(';');
    return nodo;
  }

}
