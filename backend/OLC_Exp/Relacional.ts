import { Instruccion } from '../OLC_Abs/Instruccion';
import Nodo from '../OLC_Abs/Nodo_AST';
import Errores from '../OLC_Excep/Errores';
import Arbol from '../OLC_Simb/Simbolo_Arbol';
import tablaSimbolos from '../OLC_Simb/Simbolo_TablaSimbolos';
import Tipo, { tipoDato } from '../OLC_Simb/Simbolo_Tipo';

export default class Relacional extends Instruccion {
  //tipos de datos
  private Instruc1: Instruccion;
  private Instruc2: Instruccion;
  private relacion: Relacionales;

  //el metodo constructor
  constructor(
    relacion: Relacionales,
    fila: number,
    columna: number,
    Instruc1: Instruccion,
    Instruc2: Instruccion
  ) {
    super(new Tipo(tipoDato.ENTERO), fila, columna);
    this.relacion = relacion;
    this.Instruc1 = Instruc1;
    this.Instruc2 = Instruc2;
  }


  //para analizar el valor ingresado
  public interpretar(arbol: Arbol, tabla: tablaSimbolos) {
    let izq, der;
    izq = this.obtieneValor(this.Instruc1, arbol, tabla);
    if (izq instanceof Errores) return izq;
    der = this.obtieneValor(this.Instruc2, arbol, tabla);
    if (der instanceof Errores) return der;
    if (
      this.Instruc1.tipoDato.getTipo() == tipoDato.CADENA &&
      this.Instruc2.tipoDato.getTipo() != tipoDato.CADENA
    ) {
      return new Errores(
        'ERROR SEMANTICO',
        'NO SE PUEDE COMPARAR UNA CADENA CON OTRO TIPO DE DATO QUE NO SEA CADENA',
        this.fila,
        this.columna
      );
    } else if (
      this.Instruc2.tipoDato.getTipo() == tipoDato.CADENA &&
      this.Instruc1.tipoDato.getTipo() != tipoDato.CADENA
    ) {
      return new Errores(
        'ERROR SEMANTICO',
        'NO SE PUEDE COMPARAR UNA CADENA CON OTRO TIPO DE DATO QUE NO SEA CADENA',
        this.fila,
        this.columna
      );
    } else {
      this.tipoDato.setTipo(tipoDato.BOOLEANO);
      switch (this.relacion) {
        case Relacionales.IGUAL:
          return izq == der;
        case Relacionales.DIFERENTE:
          return izq != der;
        case Relacionales.MENOR:
          return izq < der;
        case Relacionales.MENORIGUAL:
          return izq <= der;
        case Relacionales.MAYOR:
          return izq > der;
        case Relacionales.MAYORIGUAL:
          return izq >= der;
        default:
          return 'what';
      }
    }
  }
  //para obtner un valor en el arbol
  obtieneValor(operando: Instruccion, arbol: Arbol, tabla: tablaSimbolos): any {
    let valor = operando.interpretar(arbol, tabla);
    switch (operando.tipoDato.getTipo()) {
      case tipoDato.ENTERO:
        return parseInt(valor);
      case tipoDato.DECIMAL:
        return parseFloat(valor);
      case tipoDato.CARACTER:
        var da = valor + '';
        var res = da.charCodeAt(0);
        return res;
      case tipoDato.BOOLEANO:
        let dats = valor + '';
        let otr = dats.toLowerCase();
        return parseInt(otr);
      case tipoDato.CADENA:
        return '' + valor;
    }
  }

    //para obtener un nodo
    public getNodo(): Nodo {
      let nodo = new Nodo('RELACIONAL');
      nodo.agregarHijoAST(this.Instruc1.getNodo());
      nodo.agregarHijo(this.relacion + '', 'rel', this.relacion);
      nodo.agregarHijoAST(this.Instruc2.getNodo());
      return nodo;
    }
    
  
}

export enum Relacionales {//mi objeto de relaciones.
  IGUAL,
  DIFERENTE,
  MAYOR,
  MENOR,
  MAYORIGUAL,
  MENORIGUAL,
}
