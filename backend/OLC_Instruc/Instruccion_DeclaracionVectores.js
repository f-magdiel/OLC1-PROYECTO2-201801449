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
const Simbolo_Tipo_1 = require("../OLC_Simb/Simbolo_Tipo");
class declaracionVectores extends Instruccion_1.Instruccion {
    //el metodo constructor
    constructor(tipo, identificador, tipoDeclaracion, fila, columna, cantidad, tipoVector, listaValores) {
        super(tipo, fila, columna);
        this.tipo = tipo;
        this.identificador = identificador;
        this.tipoDeclaracion = tipoDeclaracion;
        this.cantidad = cantidad;
        this.tipoVector = tipoVector;
        this.listaValores = listaValores;
    }
    //metodo para analizar los valores ingresados
    interpretar(arbol, tabla) {
        var _a, _b, _c;
        if (this.tipoDeclaracion) {
            if (this.tipoVector == null)
                return new Errores_1.default('SINTACTICO', 'NO EXISTE TIPO DE DATO DE VECTOR', this.fila, this.columna);
            if (this.tipo.getTipo() != ((_a = this.tipoVector) === null || _a === void 0 ? void 0 : _a.getTipo()))
                return new Errores_1.default('SEMANTICO', 'TIPOS DE DATOS DIFERENTES EN DECLARACION', this.fila, this.columna);
            else {
                let numero = (_b = this.cantidad) === null || _b === void 0 ? void 0 : _b.interpretar(arbol, tabla);
                if (numero instanceof Errores_1.default)
                    return numero;
                if (((_c = this.cantidad) === null || _c === void 0 ? void 0 : _c.tipoDato.getTipo()) != Simbolo_Tipo_1.tipoDato.ENTERO)
                    return new Errores_1.default('SEMANTICO', 'VARIABLE NO ES TIPO ENTERO', this.fila, this.columna);
                let num = parseInt(numero);
                let arreglo = [];
                for (let i = 0; i < num; i++) {
                    arreglo[i] = [];
                }
                if (tabla.setVariable(new Simbolo_Simbolo_1.default(this.tipo, this.identificador, arreglo)) == 'La variable existe actualmente')
                    return new Errores_1.default('SEMANTICO', 'LA VARIABLE ' + this.identificador + ' EXISTE ACTUALMENTE', this.fila, this.columna);
                else {
                    if (!arbol.actualizarTabla(this.identificador, arreglo, this.fila.toString(), tabla.getNombre().toString(), this.columna.toString())) {
                        let nuevoSimbolo = new Reporte_ReporteTabla_1.reporteTabla(this.identificador, arreglo, 'vector', (0, Reporte_CambiarTipo_1.default)(this.tipo.getTipo()) + '', tabla.getNombre(), this.fila.toString(), this.columna.toString());
                        arbol.listaSimbolos.push(nuevoSimbolo);
                    }
                }
            }
        }
        else {
            let arreglo = [];
            if (this.listaValores == null)
                this.listaValores = [];
            for (let i = 0; i < this.listaValores.length; i++) {
                let valor = this.listaValores[i].interpretar(arbol, tabla);
                if (valor instanceof Errores_1.default)
                    return valor;
                if (this.tipo.getTipo() != this.listaValores[i].tipoDato.getTipo())
                    return new Errores_1.default('SEMANTICO', 'TIPO DE DATO DIFERENTE', this.fila, this.columna);
                arreglo[i] = valor;
            }
            if (tabla.setVariable(new Simbolo_Simbolo_1.default(this.tipo, this.identificador, arreglo)) == 'La variable existe actualmente')
                return new Errores_1.default('SEMANTICO', 'LA VARIABLE ' + this.identificador + ' EXISTE ACTUALMENTE', this.fila, this.columna);
            else {
                if (!arbol.actualizarTabla(this.identificador, arreglo, this.fila.toString(), tabla.getNombre().toString(), this.columna.toString())) {
                    let nuevoSimbolo = new Reporte_ReporteTabla_1.reporteTabla(this.identificador, arreglo, 'vector', (0, Reporte_CambiarTipo_1.default)(this.tipo.getTipo()) + '', tabla.getNombre(), this.fila.toString(), this.columna.toString());
                    arbol.listaSimbolos.push(nuevoSimbolo);
                }
            }
        }
    }
    //metodo para obtener Nodo
    getNodo() {
        var _a, _b;
        let nodo = new Nodo_AST_1.default('VECTORES');
        nodo.agregarHijo((0, Reporte_CambiarTipo_1.default)(this.tipo.getTipo()) + '');
        nodo.agregarHijo(this.identificador);
        nodo.agregarHijo('[');
        nodo.agregarHijo(']');
        nodo.agregarHijo('=');
        if (this.tipoDeclaracion) {
            nodo.agregarHijo('[');
            nodo.agregarHijoAST((_a = this.cantidad) === null || _a === void 0 ? void 0 : _a.getNodo());
            nodo.agregarHijo(']');
        }
        else {
            nodo.agregarHijo('[');
            (_b = this.listaValores) === null || _b === void 0 ? void 0 : _b.forEach((res) => {
                nodo.agregarHijoAST(res.getNodo());
                nodo.agregarHijo(',');
            });
            nodo.agregarHijo(']');
        }
        nodo.agregarHijo(';');
        return nodo;
    }
}
exports.default = declaracionVectores;
