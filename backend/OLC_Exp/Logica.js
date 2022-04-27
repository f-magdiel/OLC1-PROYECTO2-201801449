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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logicas = void 0;
const Instruccion_1 = require("../OLC_Abs/Instruccion");
const Nodo_AST_1 = __importDefault(require("../OLC_Abs/Nodo_AST"));
const Errores_1 = __importDefault(require("../OLC_Excep/Errores"));
const Simbolo_Tipo_1 = __importStar(require("../OLC_Simb/Simbolo_Tipo"));
class Logica extends Instruccion_1.Instruccion {
    //meotodo constructor
    constructor(relacion, fila, columna, Instruc1, Instruc2) {
        super(new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO), fila, columna);
        this.Logic = relacion;
        if (!Instruc2)
            this.Condicion_Excepcion = Instruc1;
        else {
            this.Instruc1 = Instruc1;
            this.Instruc2 = Instruc2;
        }
    }
    //metodod para analizar la informacion
    interpretar(arbol, tabla) {
        var _a, _b;
        let izq, der, unico;
        izq = der = unico = null;
        if (this.Condicion_Excepcion != null) {
            unico = this.Condicion_Excepcion.interpretar(arbol, tabla);
            if (unico instanceof Errores_1.default)
                return unico;
        }
        else {
            izq = (_a = this.Instruc1) === null || _a === void 0 ? void 0 : _a.interpretar(arbol, tabla);
            if (izq instanceof Errores_1.default)
                return izq;
            der = (_b = this.Instruc2) === null || _b === void 0 ? void 0 : _b.interpretar(arbol, tabla);
            if (der instanceof Errores_1.default)
                return der;
        }
        //se valida a cual logica pertenece el valor ingresado
        switch (this.Logic) {
            case Logicas.AND:
                this.tipoDato.setTipo(Simbolo_Tipo_1.tipoDato.BOOLEANO);
                return izq && der ? true : false;
            case Logicas.OR:
                this.tipoDato.setTipo(Simbolo_Tipo_1.tipoDato.BOOLEANO);
                return izq || der ? true : false;
            case Logicas.NOT:
                this.tipoDato.setTipo(Simbolo_Tipo_1.tipoDato.BOOLEANO);
                return !unico;
        }
    }
    //metodo para obtener Nodo
    getNodo() {
        var _a, _b;
        let nodo = new Nodo_AST_1.default('LOGICO');
        if (this.Condicion_Excepcion != null) {
            nodo.agregarHijo(this.Logic + '', 'log', this.Logic);
            nodo.agregarHijoAST(this.Condicion_Excepcion.getNodo());
        }
        else {
            nodo.agregarHijoAST((_a = this.Instruc1) === null || _a === void 0 ? void 0 : _a.getNodo());
            nodo.agregarHijo(this.Logic + '', 'log', this.Logic);
            nodo.agregarHijoAST((_b = this.Instruc2) === null || _b === void 0 ? void 0 : _b.getNodo());
        }
        return nodo;
    }
}
exports.default = Logica;
var Logicas;
(function (Logicas) {
    Logicas[Logicas["OR"] = 0] = "OR";
    Logicas[Logicas["AND"] = 1] = "AND";
    Logicas[Logicas["NOT"] = 2] = "NOT";
})(Logicas = exports.Logicas || (exports.Logicas = {}));
