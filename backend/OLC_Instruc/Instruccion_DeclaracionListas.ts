import obtenerValor from '../OLC_Rep/Reporte_CambiarTipo';
import { reporteTabla } from '../OLC_Rep/Reporte_ReporteTabla';
import { Instruccion } from '../OLC_Abs/Instruccion';
import Nodo from '../OLC_Abs/Nodo_AST';
import Errores from '../OLC_Excep/Errores';
import Arbol from '../OLC_Simb/Simbolo_Arbol';
import Simbolo from '../OLC_Simb/Simbolo_Simbolo';
import tablaSimbolos from '../OLC_Simb/Simbolo_TablaSimbolos';
import Tipo, { tipoDato } from '../OLC_Simb/Simbolo_Tipo';

export default class declaracionListas extends Instruccion {
  //variables para tipo,identificador, expresion y vector
  private tipo: Tipo;
  private identificador: string;
  private tipoVector: Tipo | undefined;// estos pueden estar definidos o no
  private expresion: Instruccion | undefined;

  //el metodo constructor
  constructor(
    tipo: Tipo,
    identificador: string,
    fila: number,
    columna: number,
    tipoVector: Tipo | undefined,
    expresion: Instruccion | undefined
  ) {
    super(tipo, fila, columna);
    this.tipo = tipo;
    this.identificador = identificador.toLowerCase();
    this.tipoVector = tipoVector;
    this.expresion = expresion;
  }



  //metodo para analizar los valores ingresados
  public interpretar(arbol: Arbol, tabla: tablaSimbolos) {
    if (this.tipoVector != null) {
      if (this.tipo.getTipo() != this.tipoVector.getTipo())
        return new Errores(
          'SEMANTICO',
          'TIPOS DE DATOS DIFERENTES EN DECLARACION',
          this.fila,
          this.columna
        );
      else {
        let arreglo = new Array();
        if (
          tabla.setVariable(
            new Simbolo(this.tipo, this.identificador, arreglo)
          ) == 'La variable existe actualmente'
        )
          return new Errores(
            'SEMANTICO',
            'LA VARIABLE ' + this.identificador + ' EXISTE ACTUALMENTE',
            this.fila,
            this.columna
          );
        else {
          if (
            !arbol.actualizarTabla(
              this.identificador,
              arreglo.toString(),
              this.fila.toString(),
              tabla.getNombre().toString(),
              this.columna.toString()
            )
          ) {
            let nuevoSimbolo = new reporteTabla(
              this.identificador,
              arreglo.toString(),
              'lista',
              obtenerValor(this.tipo.getTipo()) + '',
              tabla.getNombre(),
              this.fila.toString(),
              this.columna.toString()
            );
            arbol.listaSimbolos.push(nuevoSimbolo);
          }
        }
      }
    } else {
      let exp = this.expresion?.interpretar(arbol, tabla);
      if (exp instanceof Errores) return exp;
      if (this.tipo.getTipo() != this.expresion?.tipoDato.getTipo())
        return new Errores(
          'SEMANTICO',
          'TIPOS DE DATOS DIFERENTES EN DECLARACION',
          this.fila,
          this.columna
        );
      let arreglo = new Array();
      for (let i = 0; i < exp.length; i++) {
        arreglo.push(exp[i]);
      }
      if (
        tabla.setVariable(
          new Simbolo(this.tipo, this.identificador, arreglo)
        ) == 'La variable existe actualmente'
      )
        return new Errores(
          'SEMANTICO',
          'LA VARIABLE ' + this.identificador + ' EXISTE ACTUALMENTE',
          this.fila,
          this.columna
        );
      else {
        if (
          !arbol.actualizarTabla(
            this.identificador,
            arreglo.toString(),
            this.fila.toString(),
            tabla.getNombre().toString(),
            this.columna.toString()
          )
        ) {
          let nuevoSimbolo = new reporteTabla(
            this.identificador,
            arreglo.toString(),
            'lista',
            obtenerValor(this.tipo.getTipo()) + '',
            tabla.getNombre(),
            this.fila.toString(),
            this.columna.toString()
          );
          arbol.listaSimbolos.push(nuevoSimbolo);
        }
      }
    }
  }

    //el metodo para obtener nodo
    public getNodo() {
      let nodo = new Nodo('LISTAS');
      nodo.agregarHijo('list');
      nodo.agregarHijo('<');
      nodo.agregarHijo(obtenerValor(this.tipo.getTipo()) + '');
      nodo.agregarHijo('>');
      nodo.agregarHijo(this.identificador);
      nodo.agregarHijo('=');
      nodo.agregarHijo('new');
      nodo.agregarHijo('list');
      nodo.agregarHijo('<');
      nodo.agregarHijo(obtenerValor(this.tipoVector?.getTipo()) + '');
      nodo.agregarHijo('>');
      nodo.agregarHijo(';');
      return nodo;
    }
}
