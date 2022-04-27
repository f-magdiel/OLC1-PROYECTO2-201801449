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
const Instruccion_1 = require("../../OLC_Abs/Instruccion");
const Nodo_AST_1 = __importDefault(require("../../OLC_Abs/Nodo_AST"));
const Errores_1 = __importDefault(require("../../OLC_Excep/Errores"));
const Simbolo_Tipo_1 = __importStar(require("../../OLC_Simb/Simbolo_Tipo"));
class condIfTernario extends Instruccion_1.Instruccion {
    constructor(cond, conIf, conElse, fila, columna) {
        super(new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO), fila, columna);
        this.condicion = cond;
        this.condIf = conIf;
        this.condElse = conElse;
    }
    getNodo() {
        let nodo = new Nodo_AST_1.default('TERNARIO');
        nodo.agregarHijoAST(this.condicion.getNodo());
        nodo.agregarHijo('?');
        nodo.agregarHijoAST(this.condIf.getNodo());
        nodo.agregarHijo(':');
        nodo.agregarHijoAST(this.condElse.getNodo());
        return nodo;
    }
    interpretar(arbol, tabla) {
        let val = this.condicion.interpretar(arbol, tabla);
        if (val instanceof Errores_1.default)
            return val;
        if (this.condicion.tipoDato.getTipo() != Simbolo_Tipo_1.tipoDato.BOOLEANO) {
            return new Errores_1.default('SEMANTICO', 'DATO DEBE SER BOOLEANO', this.fila, this.columna);
        }
        if (Boolean(val)) {
            let ifc = this.condIf.interpretar(arbol, tabla);
            if (ifc instanceof Errores_1.default)
                return ifc;
            this.tipoDato.setTipo(this.condIf.tipoDato.getTipo());
            return ifc;
        }
        else {
            let elsec = this.condElse.interpretar(arbol, tabla);
            if (elsec instanceof Errores_1.default)
                return elsec;
            this.tipoDato.setTipo(this.condElse.tipoDato.getTipo());
            return elsec;
        }
    }
}
exports.default = condIfTernario;
