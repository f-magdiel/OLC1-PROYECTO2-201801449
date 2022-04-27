"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Reporte_CambiarTipo_1 = __importDefault(require("../OLC_Rep/Reporte_CambiarTipo"));
const Reporte_ReporteTabla_1 = require("../OLC_Rep/Reporte_ReporteTabla");
const Instruccion_1 = require("../OLC_Abs/Instruccion");
const Nodo_AST_1 = __importDefault(require("../OLC_Abs/Nodo_AST"));
const Errores_1 = __importDefault(require("../OLC_Excep/Errores"));
const Simbolo_Simbolo_1 = __importDefault(require("../OLC_Simb/Simbolo_Simbolo"));
class declaracionListas extends Instruccion_1.Instruccion {
    //el metodo constructor
    constructor(tipo, identificador, fila, columna, tipoVector, expresion) {
        super(tipo, fila, columna);
        this.tipo = tipo;
        this.identificador = identificador.toLowerCase();
        this.tipoVector = tipoVector;
        this.expresion = expresion;
    }
    //metodo para analizar los valores ingresados
    interpretar(arbol, tabla) {
        var _a, _b;
        if (this.tipoVector != null) {
            if (this.tipo.getTipo() != this.tipoVector.getTipo())
                return new Errores_1.default('SEMANTICO', 'TIPOS DE DATOS DIFERENTES EN DECLARACION', this.fila, this.columna);
            else {
                let arreglo = new Array();
                if (tabla.setVariable(new Simbolo_Simbolo_1.default(this.tipo, this.identificador, arreglo)) == 'La variable existe actualmente')
                    return new Errores_1.default('SEMANTICO', 'LA VARIABLE ' + this.identificador + ' EXISTE ACTUALMENTE', this.fila, this.columna);
                else {
                    if (!arbol.actualizarTabla(this.identificador, arreglo.toString(), this.fila.toString(), tabla.getNombre().toString(), this.columna.toString())) {
                        let nuevoSimbolo = new Reporte_ReporteTabla_1.reporteTabla(this.identificador, arreglo.toString(), 'lista', (0, Reporte_CambiarTipo_1.default)(this.tipo.getTipo()) + '', tabla.getNombre(), this.fila.toString(), this.columna.toString());
                        arbol.listaSimbolos.push(nuevoSimbolo);
                    }
                }
            }
        }
        else {
            let exp = (_a = this.expresion) === null || _a === void 0 ? void 0 : _a.interpretar(arbol, tabla);
            if (exp instanceof Errores_1.default)
                return exp;
            if (this.tipo.getTipo() != ((_b = this.expresion) === null || _b === void 0 ? void 0 : _b.tipoDato.getTipo()))
                return new Errores_1.default('SEMANTICO', 'TIPOS DE DATOS DIFERENTES EN DECLARACION', this.fila, this.columna);
            let arreglo = new Array();
            for (let i = 0; i < exp.length; i++) {
                arreglo.push(exp[i]);
            }
            if (tabla.setVariable(new Simbolo_Simbolo_1.default(this.tipo, this.identificador, arreglo)) == 'La variable existe actualmente')
                return new Errores_1.default('SEMANTICO', 'LA VARIABLE ' + this.identificador + ' EXISTE ACTUALMENTE', this.fila, this.columna);
            else {
                if (!arbol.actualizarTabla(this.identificador, arreglo.toString(), this.fila.toString(), tabla.getNombre().toString(), this.columna.toString())) {
                    let nuevoSimbolo = new Reporte_ReporteTabla_1.reporteTabla(this.identificador, arreglo.toString(), 'lista', (0, Reporte_CambiarTipo_1.default)(this.tipo.getTipo()) + '', tabla.getNombre(), this.fila.toString(), this.columna.toString());
                    arbol.listaSimbolos.push(nuevoSimbolo);
                }
            }
        }
    }
    //el metodo para obtener nodo
    getNodo() {
        var _a;
        let nodo = new Nodo_AST_1.default('LISTAS');
        nodo.agregarHijo('list');
        nodo.agregarHijo('<');
        nodo.agregarHijo((0, Reporte_CambiarTipo_1.default)(this.tipo.getTipo()) + '');
        nodo.agregarHijo('>');
        nodo.agregarHijo(this.identificador);
        nodo.agregarHijo('=');
        nodo.agregarHijo('new');
        nodo.agregarHijo('list');
        nodo.agregarHijo('<');
        nodo.agregarHijo((0, Reporte_CambiarTipo_1.default)((_a = this.tipoVector) === null || _a === void 0 ? void 0 : _a.getTipo()) + '');
        nodo.agregarHijo('>');
        nodo.agregarHijo(';');
        return nodo;
    }
}
exports.default = declaracionListas;
