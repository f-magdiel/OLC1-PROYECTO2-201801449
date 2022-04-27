import { Instruccion } from '../OLC_Abs/Instruccion';
import Nodo from '../OLC_Abs/Nodo_AST';
import Errores from '../OLC_Excep/Errores';
import Arbol from '../OLC_Simb/Simbolo_Arbol';
import tablaSimbolos from '../OLC_Simb/Simbolo_TablaSimbolos';
import Tipo, { tipoDato } from '../OLC_Simb/Simbolo_Tipo';

export default class Logica extends Instruccion {
  //tipo de datos a utilizar
  private Instruc1: Instruccion | undefined;
  private Instruc2: Instruccion | undefined;
  private Condicion_Excepcion: Instruccion | undefined;
  private Logic: Logicas;

  //meotodo constructor
  constructor(
    relacion: Logicas,
    fila: number,
    columna: number,
    Instruc1: Instruccion,
    Instruc2?: Instruccion
  ) {
    super(new Tipo(tipoDato.ENTERO), fila, columna);
    this.Logic = relacion;
    if (!Instruc2) this.Condicion_Excepcion = Instruc1;
    else {
      this.Instruc1 = Instruc1;
      this.Instruc2 = Instruc2;
    }
  }

  
  //metodod para analizar la informacion
  public interpretar(arbol: Arbol, tabla: tablaSimbolos) {
    let izq, der, unico;
    izq = der = unico = null;
    if (this.Condicion_Excepcion != null) {
      unico = this.Condicion_Excepcion.interpretar(arbol, tabla);
      if (unico instanceof Errores) return unico;
    } else {
      izq = this.Instruc1?.interpretar(arbol, tabla);
      if (izq instanceof Errores) return izq;
      der = this.Instruc2?.interpretar(arbol, tabla);
      if (der instanceof Errores) return der;
    }
    //se valida a cual logica pertenece el valor ingresado
    switch (this.Logic) {
      case Logicas.AND:
        this.tipoDato.setTipo(tipoDato.BOOLEANO);
        return izq && der ? true : false;
      case Logicas.OR:
        this.tipoDato.setTipo(tipoDato.BOOLEANO);
        return izq || der ? true : false;
      case Logicas.NOT:
        this.tipoDato.setTipo(tipoDato.BOOLEANO);

        return !unico;
    }
  }

  //metodo para obtener Nodo
  public getNodo(): Nodo {
    let nodo = new Nodo('LOGICO');
    if (this.Condicion_Excepcion != null) {
      nodo.agregarHijo(this.Logic + '', 'log', this.Logic);
      nodo.agregarHijoAST(this.Condicion_Excepcion.getNodo());
    } else {
      nodo.agregarHijoAST(this.Instruc1?.getNodo());
      nodo.agregarHijo(this.Logic + '', 'log', this.Logic);
      nodo.agregarHijoAST(this.Instruc2?.getNodo());
    }
    return nodo;
  }
}

export enum Logicas {
  OR,
  AND,
  NOT,
}
