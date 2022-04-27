import obtenerValor from '../OLC_Rep/Reporte_CambiarTipo';
import { Instruccion } from '../OLC_Abs/Instruccion';
import Nodo from '../OLC_Abs/Nodo_AST';
import Errores from '../OLC_Excep/Errores';
import Arbol from '../OLC_Simb/Simbolo_Arbol';
import tablaSimbolos from '../OLC_Simb/Simbolo_TablaSimbolos';
import Tipo from '../OLC_Simb/Simbolo_Tipo';
import Return from './Instruccion_Return';

export default class Metodos extends Instruccion {

  //variables para los metodos
  public identificador: String;
  public parametros: any; // puede recibir cualquier tipo de datos
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

  //metodo para analizar los valores ingresados
  public interpretar(arbol: Arbol, tabla: tablaSimbolos) {
    for (let i = 0; i < this.instrucciones.length; i++) {
      let val = this.instrucciones[i].interpretar(arbol, tabla);
      if (val instanceof Errores) return val;
      if (this.instrucciones[i] instanceof Return) {
        if (val instanceof Return) {
          if (val.valor != null) {
            return new Errores(
              'SEMANTICO',
              'NO PUEDE DEVOLVER UN VALOR EN UN METODO',
              this.fila,
              this.columna
            );
          } else break;
        } else
          return new Errores(
            'SEMANTICO',
            'NO PUEDE DEVOLVER UN VALOR EN UN METODO',
            this.fila,
            this.columna
          );
      }
    }
  }

  //metodo para obtener nodo
  public getNodo(): Nodo {
    
    let nodo = new Nodo('METODO');
   
    nodo.agregarHijo(this.identificador + '');
    nodo.agregarHijo('(');
    let nuevo = null;
    if (this.parametros.length > 0) {
      nuevo = new Nodo('PARAMETROS');//para recibir los parametros 
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
    nodo.agregarHijo('void');
    nodo.agregarHijo('{');
    this.instrucciones.forEach((element) => {
      nodo.agregarHijoAST(element.getNodo());
    });
    nodo.agregarHijo('}');
    return nodo;
  }
}
