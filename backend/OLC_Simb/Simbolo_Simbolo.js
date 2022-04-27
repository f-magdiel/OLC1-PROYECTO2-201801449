"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Simbolo {
    constructor(tipo, identificador, valor) {
        this.tipo = tipo;
        this.identificador = identificador.toLowerCase(); // convierto en minisculas
        this.valor = valor;
    }
    //getters y setters de los simbolos
    gettipo() {
        return this.tipo;
    }
    settipo(value) {
        this.tipo = value;
    }
    getidentificador() {
        return this.identificador;
    }
    setidentificador(value) {
        this.identificador = value;
    }
    getvalor() {
        return this.valor;
    }
    setvalor(value) {
        this.valor = value;
    }
}
exports.default = Simbolo;
