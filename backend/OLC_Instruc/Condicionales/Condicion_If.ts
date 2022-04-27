import { listaErrores } from '../../indexControllers';
import { Instruccion } from '../../OLC_Abs/Instruccion';
import nodoAST from '../../OLC_Abs/Nodo_AST';
import Errores from '../../OLC_Excep/Errores';
import Arbol from '../../OLC_Simb/Simbolo_Arbol';
import tablaSimbolos from '../../OLC_Simb/Simbolo_TablaSimbolos';
import Tipo, { tipoDato } from '../../OLC_Simb/Simbolo_Tipo';
import Return from '../Instruccion_Return';

export default class condIf extends Instruccion {
  private cond1: Instruccion;
  private condIf: Instruccion[];
  private condElse: Instruccion[] | undefined;
  private condElseIf: Instruccion | undefined;
  constructor(
    fila: number,
    columna: number,
    cond1: Instruccion,
    condIf: Instruccion[],
    condElse: Instruccion[] | undefined,
    condElseIf: Instruccion | undefined
  ) {
    super(new Tipo(tipoDato.ENTERO), fila, columna);
    this.cond1 = cond1;
    this.condIf = condIf;
    this.condElse = condElse;
    this.condElseIf = condElseIf;
  }
  public getNodo(): nodoAST {
    let nodo = new nodoAST('IF');
    nodo.agregarHijo('if');
    nodo.agregarHijo('(');
    nodo.agregarHijoAST(this.cond1.getNodo());
    nodo.agregarHijo(')');
    nodo.agregarHijo('{');
    this.condIf.forEach((element) => {
      nodo.agregarHijoAST(element.getNodo());
    });
    nodo.agregarHijo('}');
    if (this.condElse != undefined) {
      nodo.agregarHijo('else');
      nodo.agregarHijo('{');
      this.condElse.forEach((element) => {
        nodo.agregarHijoAST(element.getNodo());
      });
      nodo.agregarHijo('}');
    }
    if (this.condElseIf != undefined) {
      nodo.agregarHijo('else');
      nodo.agregarHijo('if');
      nodo.agregarHijo('{');
      nodo.agregarHijoAST(this.condElseIf.getNodo());
      nodo.agregarHijo('}');
    }
    return nodo;
  }
  public interpretar(arbol: Arbol, tabla: tablaSimbolos) {
    let val = this.cond1.interpretar(arbol, tabla);
    if (this.cond1.tipoDato.getTipo() != tipoDato.BOOLEANO) {
      return new Errores(
        'SEMANTICO',
        'DATO DEBE SER BOOLEANO',
        this.fila,
        this.columna
      );
    }
    if (val) {
      let nuevaTabla = new tablaSimbolos(tabla);
      nuevaTabla.setNombre('If');
      for (let i = 0; i < this.condIf.length; i++) {
        let a = this.condIf[i].interpretar(arbol, nuevaTabla);
        if (a instanceof Errores) {
          listaErrores.push(a);
          arbol.actualizaConsola((<Errores>a).returnError());
        }
        if (a instanceof Return) return a;
        if (a == 'ByLyContinue') return a;
        if (a == 'ByLy23') return a;
      }
    } else {
      if (this.condElse != undefined) {
        let nuevaTabla = new tablaSimbolos(tabla);
        nuevaTabla.setNombre('else');
        for (let i = 0; i < this.condElse.length; i++) {
          let a = this.condElse[i].interpretar(arbol, nuevaTabla);
          if (a instanceof Errores) {
            listaErrores.push(a);
            arbol.actualizaConsola((<Errores>a).returnError());
          }
          if (a instanceof Return) return a;
          if (a == 'ByLyContinue') return a;
          if (a == 'ByLy23') return a;
        }
      } else if (this.condElseIf != undefined) {
        let b = this.condElseIf.interpretar(arbol, tabla);
        if (b instanceof Errores) return b;
        if (b instanceof Return) return b;
        if (b == 'ByLyContinue') return b;
        if (b == 'ByLy23') return b;
      }
    }

  }
}
