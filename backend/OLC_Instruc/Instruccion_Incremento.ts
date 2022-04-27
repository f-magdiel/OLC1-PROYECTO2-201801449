import { Instruccion } from '../OLC_Abs/Instruccion';
import Nodo from '../OLC_Abs/Nodo_AST';
import Errores from '../OLC_Excep/Errores';
import Identificador from '../OLC_Exp/Identificador';
import Arbol from '../OLC_Simb/Simbolo_Arbol';
import tablaSimbolos from '../OLC_Simb/Simbolo_TablaSimbolos';
import Tipo, { tipoDato } from '../OLC_Simb/Simbolo_Tipo';

export default class Decremento extends Instruccion {
  //variable para el incremento, como identificador
  private identificador: Identificador | Instruccion;

  //el metodo constructor
  constructor(
    identificador: Identificador | Instruccion,
    fila: number,
    columna: number
  ) {
    super(new Tipo(tipoDato.ENTERO), fila, columna);
    this.identificador = identificador;
  }

  //el metodo para analizar los valors ingresados
  public interpretar(arbol: Arbol, tabla: tablaSimbolos) {
   
    if (this.identificador instanceof Identificador) {
      let variable = tabla.getVariable(this.identificador.identificador);
      if (variable != null) {
        if (
          variable.gettipo().getTipo() == tipoDato.ENTERO ||
          variable.gettipo().getTipo() == tipoDato.DECIMAL
        ) {
          this.tipoDato.setTipo(variable.gettipo().getTipo());
          let uno = variable.getvalor();
          uno++;
          variable.setvalor(uno);
        } else {
          return new Errores(
            'SEMANTICO',
            'VARIABLE ' + this.identificador + ' DEBE SER VALOR NUMERICO',
            this.fila,
            this.columna
          );
        }
      } else {
        return new Errores(
          'SEMANTICO',
          'VARIABLE ' + this.identificador + ' NO EXISTE',
          this.fila,
          this.columna
        );
      }
    } else {
      let valE = this.identificador.interpretar(arbol, tabla);
      if (valE instanceof Errores) return valE;
      if (this.identificador.tipoDato.getTipo() == tipoDato.ENTERO) {
        this.tipoDato.setTipo(tipoDato.ENTERO);
        let otro = parseInt(valE);
        otro++;
        return otro;
      } else if (this.identificador.tipoDato.getTipo() == tipoDato.DECIMAL) {
        this.tipoDato.setTipo(tipoDato.DECIMAL);
        let otro = parseFloat(valE);
        otro++;
        return otro;
      } else {
        return new Errores(
          'SEMANTICO',
          'VARIABLE ' + this.identificador + ' DEBE SER VALOR NUMERICO',
          this.fila,
          this.columna
        );
      }
    }
  }

   //el metodo constructor
   public getNodo(): Nodo {
    let nodo = new Nodo('INCREMENTO');
    nodo.agregarHijoAST(this.identificador.getNodo());
    nodo.agregarHijo('+');
    nodo.agregarHijo('+');
    return nodo;
  }
}
