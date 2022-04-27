"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tipoDato = void 0;
class Tipo {
    //el metodo constructor
    constructor(tipos) {
        this.tipos = tipos;
    }
    //getter y setter
    igual(compara) {
        return (this.tipos = compara.tipos);
    }
    setTipo(tipo) {
        this.tipos = tipo;
    }
    getTipo() {
        return this.tipos;
    }
}
exports.default = Tipo;
var tipoDato;
(function (tipoDato) {
    tipoDato[tipoDato["ENTERO"] = 0] = "ENTERO";
    tipoDato[tipoDato["DECIMAL"] = 1] = "DECIMAL";
    tipoDato[tipoDato["BOOLEANO"] = 2] = "BOOLEANO";
    tipoDato[tipoDato["CARACTER"] = 3] = "CARACTER";
    tipoDato[tipoDato["CADENA"] = 4] = "CADENA";
    tipoDato[tipoDato["VOID"] = 5] = "VOID";
})(tipoDato = exports.tipoDato || (exports.tipoDato = {}));
