"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reporteTabla = void 0;
class reporteTabla {
    //los inicializo
    constructor(identificador, valor, forma, tipo, entorno, linea, columna) {
        this.identificador = identificador.toLowerCase();
        this.forma = forma;
        this.tipo = tipo;
        this.entorno = entorno;
        this.linea = linea;
        this.columna = columna;
        this.valor = valor;
    }
    //metodos para acceder a la info
    getIdentificador() {
        return this.identificador;
    }
    getForma() {
        return this.forma;
    }
    getTipo() {
        return this.tipo;
    }
    getEntorno() {
        return this.entorno;
    }
    getLinea() {
        return this.linea;
    }
    getColumna() {
        return this.columna;
    }
    getValor() {
        return this.valor;
    }
    setLinea(linea) {
        this.linea = linea;
    }
    setColumna(col) {
        this.columna = col;
    }
    setValor(val) {
        this.valor = val;
    }
    setEntorno(ent) {
        this.entorno = ent;
    }
}
exports.reporteTabla = reporteTabla;
