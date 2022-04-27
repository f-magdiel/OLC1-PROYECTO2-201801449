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
const Instruccion_1 = require("../OLC_Abs/Instruccion");
const Nodo_AST_1 = __importDefault(require("../OLC_Abs/Nodo_AST"));
const Errores_1 = __importDefault(require("../OLC_Excep/Errores"));
const Simbolo_TablaSimbolos_1 = __importDefault(require("../OLC_Simb/Simbolo_TablaSimbolos"));
const Simbolo_Tipo_1 = __importStar(require("../OLC_Simb/Simbolo_Tipo"));
const Instruccion_Declaracion_1 = __importDefault(require("./Instruccion_Declaracion"));
const Instruccion_Metodos_1 = __importDefault(require("./Instruccion_Metodos"));
class Exec extends Instruccion_1.Instruccion {
    //el metodo constructor
    constructor(identificador, parametros, fila, columna) {
        super(new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO), fila, columna);
        this.identificador = identificador.toLowerCase();
        this.parametros = parametros;
    }
    //metodo para analizar los valores ingresados
    interpretar(arbol, tabla) {
        var _a;
        let funcion = arbol.getFuncion(this.identificador);
        if (funcion == null)
            return new Errores_1.default('SEMANTICO', 'NO SE ENCONTRO LA FUNCION', this.fila, this.columna);
        if (funcion instanceof Instruccion_Metodos_1.default) {
            let metodo = funcion;
            if (metodo.parametros.length == ((_a = this.parametros) === null || _a === void 0 ? void 0 : _a.length)) {
                let nuevaTabla = new Simbolo_TablaSimbolos_1.default(arbol.gettablaGlobal());
                for (let param = 0; param < this.parametros.length; param++) {
                    let newVal = this.parametros[param].interpretar(arbol, tabla);
                    if (newVal instanceof Errores_1.default)
                        return newVal;
                    let dec = new Instruccion_Declaracion_1.default(metodo.parametros[param].tipato, metodo.fila, metodo.columna, metodo.parametros[param].identificador);
                    let nuevaDec = dec.interpretar(arbol, nuevaTabla);
                    if (nuevaDec instanceof Errores_1.default)
                        return nuevaDec;
                    let variable = nuevaTabla.getVariable(metodo.parametros[param].identificador);
                    if (variable != null) {
                        if (variable.gettipo().getTipo() !=
                            this.parametros[param].tipoDato.getTipo()) {
                            return new Errores_1.default('SEMANTICO', 'VARIABLE ' +
                                metodo.parametros[param].identificador +
                                ' TIPOS DE DATOS DIFERENTES', this.fila, this.columna);
                        }
                        else {
                            variable.setvalor(newVal);
                            nuevaTabla.setNombre(funcion.identificador);
                        }
                    }
                    else {
                        return new Errores_1.default('SEMANTICO', 'VARIABLE ' +
                            metodo.parametros[param].identificador +
                            ' NO EXISTE', this.fila, this.columna);
                    }
                }
                let nuevMet = metodo.interpretar(arbol, nuevaTabla);
                if (nuevMet instanceof Errores_1.default)
                    return nuevMet;
            }
            else {
                return new Errores_1.default('SEMANTICO', 'PARAMETROS NO COINCIDENTES', this.fila, this.columna);
            }
        }
    }
    //metodo para obtener un nodo
    getNodo() {
        let nodo = new Nodo_AST_1.default('RUN');
        nodo.agregarHijo('run');
        nodo.agregarHijo(this.identificador + '');
        nodo.agregarHijo('(');
        this.parametros.forEach((element) => {
            nodo.agregarHijoAST(element.getNodo());
        });
        nodo.agregarHijo(')');
        nodo.agregarHijo(';');
        return nodo;
    }
}
exports.default = Exec;
