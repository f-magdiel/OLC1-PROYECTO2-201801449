"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Reporte_ReporteTabla_1 = require("../OLC_Rep/Reporte_ReporteTabla");
const Instruccion_1 = require("../OLC_Abs/Instruccion");
const Nodo_AST_1 = __importDefault(require("../OLC_Abs/Nodo_AST"));
const Errores_1 = __importDefault(require("../OLC_Excep/Errores"));
const Simbolo_Simbolo_1 = __importDefault(require("../OLC_Simb/Simbolo_Simbolo"));
const Simbolo_Tipo_1 = require("../OLC_Simb/Simbolo_Tipo");
const Reporte_CambiarTipo_1 = __importDefault(require("../OLC_Rep/Reporte_CambiarTipo"));
class Declaracion extends Instruccion_1.Instruccion {
    //el metoodo constructor
    constructor(tipo, fila, columna, id, valor) {
        super(tipo, fila, columna);
        this.tipo = tipo;
        this.identificador = id;
        this.valor = valor;
    }
    //para analizar los valores ingresados
    interpretar(arbol, tabla) {
        if (this.valor === undefined) {
            switch (this.tipo.getTipo()) {
                case Simbolo_Tipo_1.tipoDato.ENTERO:
                    if (tabla.setVariable(new Simbolo_Simbolo_1.default(this.tipo, this.identificador, 0)) ==
                        'La variable existe actualmente') {
                        return new Errores_1.default('SEMANTICO', 'LA VARIABLE ' + this.identificador + ' EXISTE ACTUALMENTE', this.fila, this.columna);
                    }
                    else {
                        if (!arbol.actualizarTabla(this.identificador, '0', this.fila.toString(), tabla.getNombre().toString(), this.columna.toString())) {
                            let nuevoSimbolo = new Reporte_ReporteTabla_1.reporteTabla(this.identificador, '0', 'Variable', (0, Reporte_CambiarTipo_1.default)(this.tipo.getTipo()) + '', tabla.getNombre(), this.fila.toString(), this.columna.toString());
                            arbol.listaSimbolos.push(nuevoSimbolo);
                        }
                    }
                    break;
                case Simbolo_Tipo_1.tipoDato.DECIMAL:
                    if (tabla.setVariable(new Simbolo_Simbolo_1.default(this.tipo, this.identificador, 0.0)) == 'La variable existe actualmente') {
                        return new Errores_1.default('SEMANTICO', 'LA VARIABLE ' + this.identificador + ' EXISTE ACTUALMENTE', this.fila, this.columna);
                    }
                    else {
                        if (!arbol.actualizarTabla(this.identificador, '0.0', this.fila.toString(), tabla.getNombre().toString(), this.columna.toString())) {
                            let nuevoSimbolo = new Reporte_ReporteTabla_1.reporteTabla(this.identificador, '0.0', 'Variable', (0, Reporte_CambiarTipo_1.default)(this.tipo.getTipo()) + '', tabla.getNombre(), this.fila.toString(), this.columna.toString());
                            arbol.listaSimbolos.push(nuevoSimbolo);
                        }
                    }
                    break;
                case Simbolo_Tipo_1.tipoDato.CARACTER:
                    if (tabla.setVariable(new Simbolo_Simbolo_1.default(this.tipo, this.identificador, '\u0000')) == 'La variable existe actualmente') {
                        return new Errores_1.default('SEMANTICO', 'LA VARIABLE ' + this.identificador + ' EXISTE ACTUALMENTE', this.fila, this.columna);
                    }
                    else {
                        if (!arbol.actualizarTabla(this.identificador, '\u0000', this.fila.toString(), tabla.getNombre().toString(), this.columna.toString())) {
                            let nuevoSimbolo = new Reporte_ReporteTabla_1.reporteTabla(this.identificador, '\u0000', 'Variable', (0, Reporte_CambiarTipo_1.default)(this.tipo.getTipo()) + '', tabla.getNombre(), this.fila.toString(), this.columna.toString());
                            arbol.listaSimbolos.push(nuevoSimbolo);
                        }
                    }
                    break;
                case Simbolo_Tipo_1.tipoDato.CADENA:
                    if (tabla.setVariable(new Simbolo_Simbolo_1.default(this.tipo, this.identificador, '')) ==
                        'La variable existe actualmente') {
                        return new Errores_1.default('SEMANTICO', 'LA VARIABLE ' + this.identificador + ' EXISTE ACTUALMENTE', this.fila, this.columna);
                    }
                    else {
                        if (!arbol.actualizarTabla(this.identificador, '', this.fila.toString(), tabla.getNombre().toString(), this.columna.toString())) {
                            let nuevoSimbolo = new Reporte_ReporteTabla_1.reporteTabla(this.identificador, '', 'Variable', (0, Reporte_CambiarTipo_1.default)(this.tipo.getTipo()) + '', tabla.getNombre(), this.fila.toString(), this.columna.toString());
                            arbol.listaSimbolos.push(nuevoSimbolo);
                        }
                    }
                    break;
                case Simbolo_Tipo_1.tipoDato.BOOLEANO:
                    if (tabla.setVariable(new Simbolo_Simbolo_1.default(this.tipo, this.identificador, true)) == 'La variable existe actualmente') {
                        return new Errores_1.default('SEMANTICO', 'LA VARIABLE ' + this.identificador + ' EXISTE ACTUALMENTE', this.fila, this.columna);
                    }
                    else {
                        if (!arbol.actualizarTabla(this.identificador, 'true', this.fila.toString(), tabla.getNombre().toString(), this.columna.toString())) {
                            let nuevoSimbolo = new Reporte_ReporteTabla_1.reporteTabla(this.identificador, 'true', 'Variable', (0, Reporte_CambiarTipo_1.default)(this.tipo.getTipo()) + '', tabla.getNombre(), this.fila.toString(), this.columna.toString());
                            arbol.listaSimbolos.push(nuevoSimbolo);
                        }
                    }
                    break;
            }
        }
        else {
            let val = this.valor.interpretar(arbol, tabla);
            if (this.tipo.getTipo() != this.valor.tipoDato.getTipo()) {
                return new Errores_1.default('SEMANTICO', 'TIPO DE VALOR DIFERENTE', this.fila, this.columna);
            }
            else {
                if (tabla.setVariable(new Simbolo_Simbolo_1.default(this.tipo, this.identificador, val)) ==
                    'La variable existe actualmente') {
                    return new Errores_1.default('SEMANTICO', 'LA VARIABLE ' + this.identificador + ' EXISTE ACTUALMENTE', this.fila, this.columna);
                }
                else {
                    if (!arbol.actualizarTabla(this.identificador, val, this.fila.toString(), tabla.getNombre().toString(), this.columna.toString())) {
                        let nuevoSimbolo = new Reporte_ReporteTabla_1.reporteTabla(this.identificador, val, 'Variable', (0, Reporte_CambiarTipo_1.default)(this.tipo.getTipo()) + '', tabla.getNombre(), this.fila.toString(), this.columna.toString());
                        arbol.listaSimbolos.push(nuevoSimbolo);
                    }
                }
            }
        }
    }
    //metodo para obtener un nodo
    getNodo() {
        let nodo = new Nodo_AST_1.default('DECLARACION');
        nodo.agregarHijo((0, Reporte_CambiarTipo_1.default)(this.tipo.getTipo()) + '');
        nodo.agregarHijo(this.identificador);
        if (this.valor != undefined) {
            nodo.agregarHijo('=');
            nodo.agregarHijoAST(this.valor.getNodo());
        }
        nodo.agregarHijo(';');
        return nodo;
    }
}
exports.default = Declaracion;
