"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Errores {
    //metodo constructor
    constructor(tipo, description, fila, columna) {
        this.tipo = tipo;
        this.description = description;
        this.fila = fila;
        this.columna = columna;
    }
    //meotodo para obtener un tipo de error
    gettipo() {
        return this.tipo;
    }
    //metodo para obtener descriptionripcion
    getdescription() {
        return this.description;
    }
    //metodo para obtener el # de fila
    getFila() {
        return this.fila;
    }
    //meotod para obtener el # de columna
    getcolumna() {
        return this.columna;
    }
    //metodo para retornar el error como un objeto
    returnError() {
        return ('Se obtuvo: ' +
            this.tipo +
            ' description:{' +
            this.description +
            '} en la fila: ' +
            this.fila +
            ' en la columna: ' +
            this.columna +
            '\n');
    }
}
exports.default = Errores;
