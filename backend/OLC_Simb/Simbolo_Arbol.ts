import tablaSimbolos from './Simbolo_TablaSimbolos';
import { Instruccion } from '../OLC_Abs/Instruccion';
import Errores from '../OLC_Excep/Errores';
import Metodos from '../OLC_Instruc/Instruccion_Metodos';
import Funciones from '../OLC_Instruc/Instruccion_Funciones';
import { reporteTabla } from '../OLC_Rep/Reporte_ReporteTabla';
import obtenerValor from '../OLC_Rep/Reporte_CambiarTipo';
export default class Arbol {

  //arrya para guardar los que se obtenga en el jison
  private instrucciones: Array<Instruccion>;
  private errores: Array<Errores>;
  private funciones: Array<Instruccion>;
  public listaSimbolos: Array<reporteTabla>;

  //el metodo constructor
  constructor(instrucciones: Array<Instruccion>) {
    this.instrucciones = instrucciones;
    this.consola = '';
    this.tablaGlobal = new tablaSimbolos();
    this.errores = new Array<Errores>();
    this.funciones = new Array<Instruccion>();
    this.listaSimbolos = new Array<reporteTabla>();
  }


  //metodo para actualizar la tabla de simbolos
  public actualizarTabla(
    identificador: string,
    valor: string,
    linea: string,
    entorno: string,
    columna: string
  ): boolean {
    for (var elemento of this.listaSimbolos) {
      if (
        elemento.getIdentificador().toString() == identificador.toLowerCase() &&
        elemento.getEntorno().toString() == entorno.toString()
      ) {
        elemento.setValor(valor);
        elemento.setLinea(linea);
        elemento.setColumna(columna);
        return true;
      }
    }
    return false;
  }

  //metodo para buscar el tipo de datos
  public BuscarTipo(identificador: string): string {
    for (var elemento of this.listaSimbolos) {
      if (elemento.getIdentificador() == identificador.toLowerCase()) {
        return elemento.getForma().toString();
      }
    }
    return 'as';
  }

  //metodo para obtener nombre funcion
  public getFuncion(identificador: String) {
    for (let f of this.funciones) {
      if (f instanceof Metodos) {
        if (
          identificador.toLowerCase() ==
          (<Metodos>f).identificador.toLowerCase()
        ) {
          if (
            !this.actualizarTabla(
              f.identificador.toString(),
              '',
              f.fila.toString(),
              '',
              f.columna.toString()
            )
          ) {
            let nuevoSimbolo = new reporteTabla(
              f.identificador,
              '',
              'MetodoCreacion',
              'void',
              '',
              f.fila.toString(),
              f.columna.toString()
            );
            this.listaSimbolos.push(nuevoSimbolo);
          }

          return f;
        }
      } else if (f instanceof Funciones) {
        if (
          identificador.toLowerCase() ==
          (<Funciones>f).identificador.toLowerCase()
        ) {
          if (
            !this.actualizarTabla(
              f.identificador.toString(),
              '',
              f.fila.toString(),
              '',
              f.columna.toString()
            )
          ) {
            let nuevoSimbolo = new reporteTabla(
              f.identificador,
              '',
              'FuncionCreacion',
              obtenerValor(f.tipoDato.getTipo()) + '',
              '',
              f.fila.toString(),
              f.columna.toString()
            );
            this.listaSimbolos.push(nuevoSimbolo);
          }
          return f;
        }
      }
    }
  }

  //metodos para obtener los arrays
  //metodo para obtener el arrya de simbolos
  public getSimbolos(): Array<reporteTabla> {
    return this.listaSimbolos;
  }

  public getfunciones(): Array<Instruccion> {
    return this.funciones;
  }
  public setfunciones(value: Array<Instruccion>) {
    this.funciones = value;
  }
  public geterrores(): Array<Errores> {
    return this.errores;
  }
  public seterrores(value: Array<Errores>) {
    this.errores = value;
  }

  public getinstrucciones(): Array<Instruccion> {
    return this.instrucciones;
  }
  public setinstrucciones(value: Array<Instruccion>) {
    this.instrucciones = value;
  }
  private consola: String = '';
  public getconsola(): String {
    return this.consola;
  }
  public setconsola(value: String) {
    this.consola = value;
  }
  public actualizaConsola(uptodate: String) {
    this.consola = `${this.consola}${uptodate}\n`;
  }
  public actualizaConsolaL2(uptodate: String) {
    this.consola = `${this.consola}${uptodate} `;
  }
  private tablaGlobal: tablaSimbolos;
  public gettablaGlobal(): tablaSimbolos {
    return this.tablaGlobal;
  }
  public settablaGlobal(value: tablaSimbolos) {
    this.tablaGlobal = value;
  }

 
}
