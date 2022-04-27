import Simbolo from './Simbolo_Simbolo';
import Tipo, { tipoDato } from './Simbolo_Tipo';

export default class tablaSimbolos {
    //variables directa de esta clase
    private tablaAnterior: tablaSimbolos | any;//tipo Tabla o objeto
    private tipoDato: Tipo;//tipo int...etc
    private tablaActual: Map<String, Simbolo>;
    private nombreDato: String;

    //el metodo constructor
    constructor(anterior?: tablaSimbolos) {
      this.tablaAnterior = anterior;
      this.tablaActual = new Map<String, Simbolo>();
      this.tipoDato = new Tipo(tipoDato.ENTERO);
      this.nombreDato = '';
    }

    //getter y setter
    public setVariable(simbolo: Simbolo) {
      for (let e: tablaSimbolos = this; e != null; e = e.getAnterior()) {
        let encontrado: Simbolo = <Simbolo>(
          e.getTabla().get(simbolo.getidentificador().toLowerCase())
        );
        if (encontrado != null) {
          return `La variable existe actualmente`;
        }
        break;
      }
      this.tablaActual.set(simbolo.getidentificador().toLowerCase(), simbolo);
      return `creada con exito`;
    }
    public getVariable(id: String) {
      for (let e: tablaSimbolos = this; e != null; e = e.getAnterior()) {
        let encontrado: Simbolo = <Simbolo>e.getTabla().get(id.toLowerCase());
        if (encontrado != null) {
          return encontrado;
        }
      }
      return null;
    }
    public getNombre(): String {
      return this.nombreDato;
    }
    public setNombre(nombre: String) {
      this.nombreDato = nombre;
    }
    public getAnterior() {
      return this.tablaAnterior;
    }
    public setAnterior(anterior: tablaSimbolos) {
      this.tablaAnterior = anterior;
    }
    public getTabla() {
      return this.tablaActual;
    }
    public setTabla(Tabla: Map<String, Simbolo>) {
      this.tablaActual = Tabla;
    }
  }
