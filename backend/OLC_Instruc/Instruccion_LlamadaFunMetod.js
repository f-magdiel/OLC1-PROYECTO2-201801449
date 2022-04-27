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
const Reporte_CambiarTipo_1 = __importDefault(require("../OLC_Rep/Reporte_CambiarTipo"));
const Reporte_ReporteTabla_1 = require("../OLC_Rep/Reporte_ReporteTabla");
const Instruccion_1 = require("../OLC_Abs/Instruccion");
const Nodo_AST_1 = __importDefault(require("../OLC_Abs/Nodo_AST"));
const Errores_1 = __importDefault(require("../OLC_Excep/Errores"));
const Simbolo_TablaSimbolos_1 = __importDefault(require("../OLC_Simb/Simbolo_TablaSimbolos"));
const Simbolo_Tipo_1 = __importStar(require("../OLC_Simb/Simbolo_Tipo"));
const Instruccion_Declaracion_1 = __importDefault(require("./Instruccion_Declaracion"));
const Instruccion_DeclaracionListas_1 = __importDefault(require("./Instruccion_DeclaracionListas"));
const Instruccion_DeclaracionVectores_1 = __importDefault(require("./Instruccion_DeclaracionVectores"));
const Instruccion_Funciones_1 = __importDefault(require("./Instruccion_Funciones"));
const Instruccion_Metodos_1 = __importDefault(require("./Instruccion_Metodos"));
class LlamadaFuncMetd extends Instruccion_1.Instruccion {
    //el metodo constructor
    constructor(identificador, parametros, fila, columna) {
        super(new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO), fila, columna);
        this.identificador = identificador.toLowerCase();
        this.parametros = parametros;
    }
    //metodo para analizar los valores ingresados
    interpretar(arbol, tabla) {
        var _a, _b;
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
                    let dec;
                    if (metodo.parametros[param].arreglo) {
                        dec = new Instruccion_DeclaracionVectores_1.default(metodo.parametros[param].tipato, metodo.parametros[param].identificador, false, metodo.fila, metodo.columna);
                    }
                    else if (metodo.parametros[param].lista) {
                        dec = new Instruccion_DeclaracionListas_1.default(metodo.parametros[param].tipato, metodo.parametros[param].identificador, metodo.fila, metodo.columna, metodo.parametros[param].tipato, undefined);
                    }
                    else {
                        dec = new Instruccion_Declaracion_1.default(metodo.parametros[param].tipato, metodo.fila, metodo.columna, metodo.parametros[param].identificador);
                    }
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
                            nuevaTabla.setNombre(metodo.identificador);
                            if (!arbol.actualizarTabla(this.identificador.toString(), '', this.fila.toString(), nuevaTabla.getNombre().toString(), this.columna.toString())) {
                                let nuevoSimbolo = new Reporte_ReporteTabla_1.reporteTabla(this.identificador, '', 'Metodo', 'Void', nuevaTabla.getNombre(), this.fila.toString(), this.columna.toString());
                                arbol.listaSimbolos.push(nuevoSimbolo);
                            }
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
        else if (funcion instanceof Instruccion_Funciones_1.default) {
            let metodo = funcion;
            if (metodo.parametros.length == ((_b = this.parametros) === null || _b === void 0 ? void 0 : _b.length)) {
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
                            nuevaTabla.setNombre(metodo.identificador);
                            if (!arbol.actualizarTabla(metodo.identificador.toString(), newVal, this.fila.toString(), tabla.getNombre().toString(), this.columna.toString())) {
                                let nuevoSimbolo = new Reporte_ReporteTabla_1.reporteTabla(metodo.identificador, newVal, 'Funcion', (0, Reporte_CambiarTipo_1.default)(this.tipoDato.getTipo()) + '', tabla.getNombre(), this.fila.toString(), this.columna.toString());
                                arbol.listaSimbolos.push(nuevoSimbolo);
                            }
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
                this.tipoDato = metodo.tipoDato;
                return nuevMet;
            }
            else {
                return new Errores_1.default('SEMANTICO', 'PARAMETROS NO COINCIDENTES', this.fila, this.columna);
            }
        }
    }
    //metodo para obtener Nodo
    getNodo() {
        let nodo = new Nodo_AST_1.default('LLAMADA');
        nodo.agregarHijo(this.identificador + '');
        nodo.agregarHijo('(');
        this.parametros.forEach((element) => {
            nodo.agregarHijoAST(element.getNodo());
        });
        nodo.agregarHijo(')');
        return nodo;
    }
}
exports.default = LlamadaFuncMetd;
