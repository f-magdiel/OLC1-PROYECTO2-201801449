import obtenerValor from '../OLC_Rep/Reporte_CambiarTipo';
import { Instruccion } from '../OLC_Abs/Instruccion';
import Nodo from '../OLC_Abs/Nodo_AST';
import Errores from '../OLC_Excep/Errores';
import Arbol from '../OLC_Simb/Simbolo_Arbol';
import tablaSimbolos from '../OLC_Simb/Simbolo_TablaSimbolos';
import Tipo from '../OLC_Simb/Simbolo_Tipo';
import Return from './Instruccion_Return';

export default class Funciones extends Instruccion {
  //variables para las funciones
  public identificador: String;
  public parametros: any; // que puede recibir cualquier tipo de datos
  private instrucciones: Instruccion[];

  //el metodo constructor
  constructor(
    tipo: Tipo,
    fila: number,
    columna: number,
    identificador: String,
    parametros: any,
    instrucciones: Instruccion[]
  ) {
    super(tipo, fila, columna);
    this.identificador = identificador.toLowerCase();
    this.parametros = parametros;
    this.instrucciones = instrucciones;
  }

  //para obtener un nodo
  public getNodo(): Nodo {
   
    let nodo = new Nodo('FUNCION');
   
    nodo.agregarHijo(this.identificador + '');
    nodo.agregarHijo('(');
    let nuevo = null;
    if (this.parametros.length > 0) {
      nuevo = new Nodo('PARAMETROS');
    }
    for (let param = 0; param < this.parametros.length; param++) {
      if (nuevo == null) break;
      let vari = obtenerValor(this.parametros[param].tipato.getTipo());
      let ide = this.parametros[param].identificador;
      if (vari != null) nuevo.agregarHijo(vari);
      if (ide != null) nuevo.agregarHijo(ide);
      if (param != this.parametros.length - 1) nuevo.agregarHijo(',');
    }
    if (nuevo != null) nodo.agregarHijoAST(nuevo);
    nodo.agregarHijo(')');
    nodo.agregarHijo(':');
    nodo.agregarHijo(obtenerValor(this.tipoDato.getTipo()) + '');
    nodo.agregarHijo('{');
    this.instrucciones.forEach((element) => {
      nodo.agregarHijoAST(element.getNodo());
    });
    nodo.agregarHijo('}');
    return nodo;
  }

  //para analizar los valores ingresados
  public interpretar(arbol: Arbol, tabla: tablaSimbolos) {
    for (let i = 0; i < this.instrucciones.length; i++) {
      let val = this.instrucciones[i].interpretar(arbol, tabla);
      if (val instanceof Errores) return val;
      if (val instanceof Return) {
        if (val.valor != null) {
          if (this.tipoDato.getTipo() == val.tipoDato.getTipo())
            return val.valor;
          else
            return new Errores(
              'SEMANTICO',
              'TIPOS DE DATOS DIFERENTES',
              this.fila,
              this.columna
            );
        } else {
          return new Errores(
            'SEMANTICO',
            'DEBE DEVOLVER UN VALOR EN LA FUNCION',
            this.fila,
            this.columna
          );
        }
      }
    }
  }
}
