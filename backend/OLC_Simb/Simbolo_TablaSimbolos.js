"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Simbolo_Tipo_1 = __importStar(require("./Simbolo_Tipo"));
class tablaSimbolos {
    //el metodo constructor
    constructor(anterior) {
        this.tablaAnterior = anterior;
        this.tablaActual = new Map();
        this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO);
        this.nombreDato = '';
    }
    //getter y setter
    setVariable(simbolo) {
        for (let e = this; e != null; e = e.getAnterior()) {
            let encontrado = (e.getTabla().get(simbolo.getidentificador().toLowerCase()));
            if (encontrado != null) {
                return `La variable existe actualmente`;
            }
            break;
        }
        this.tablaActual.set(simbolo.getidentificador().toLowerCase(), simbolo);
        return `creada con exito`;
    }
    getVariable(id) {
        for (let e = this; e != null; e = e.getAnterior()) {
            let encontrado = e.getTabla().get(id.toLowerCase());
            if (encontrado != null) {
                return encontrado;
            }
        }
        return null;
    }
    getNombre() {
        return this.nombreDato;
    }
    setNombre(nombre) {
        this.nombreDato = nombre;
    }
    getAnterior() {
        return this.tablaAnterior;
    }
    setAnterior(anterior) {
        this.tablaAnterior = anterior;
    }
    getTabla() {
        return this.tablaActual;
    }
    setTabla(Tabla) {
        this.tablaActual = Tabla;
    }
}
exports.default = tablaSimbolos;
