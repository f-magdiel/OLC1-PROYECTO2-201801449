"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Instruccion_1 = require("../OLC_Abs/Instruccion");
const Nodo_AST_1 = __importDefault(require("../OLC_Abs/Nodo_AST"));
const Simbolo_Tipo_1 = require("../OLC_Simb/Simbolo_Tipo");
class Nativo extends Instruccion_1.Instruccion {
    //el metodo constructor
    constructor(tipo, valor, fila, columna) {
        super(tipo, fila, columna);
        this.valor = valor;
        if (tipo.getTipo() == Simbolo_Tipo_1.tipoDato.CADENA) {
            let val = this.valor.toString();
            this.valor = val
                .replace('\\n', '\n')
                .replace('\\t', '\t')
                .replace('\\r', '\r')
                .replace('\\\\', '\\')
                .replace("\\'", "'")
                .replace('\\"', '"');
        }
    }
    //metodo para analizar el simbolo ingresado
    interpretar(arbol, tabla) {
        if (this.tipoDato.getTipo() == Simbolo_Tipo_1.tipoDato.BOOLEANO) {
            return this.valor == 'true' ? true : false;
        }
        return this.valor;
    }
    //metodo para obtener el Nodo
    getNodo() {
        let nodo = new Nodo_AST_1.default('NATIVO');
        nodo.agregarHijo(this.valor + '');
        return nodo;
    }
}
exports.default = Nativo;
