"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Nodo_AST {
    //metodo constructor recibe un valor para inicializar
    constructor(valor) {
        this.Lista = new Array();
        this.valor = valor;
    }
    //metodo para agregar un valor al arbol 
    agregarHijo(val, ambito, operador) {
        if (ambito != undefined) {
            switch (ambito) {
                case 'ar':
                    switch (operador) {
                        case 0:
                            val = '+';
                            break;
                        case 1:
                            val = '-';
                            break;
                        case 2:
                            val = '*';
                            break;
                        case 3:
                            val = '/';
                            break;
                        case 4:
                            val = '^';
                            break;
                        case 5:
                            val = '%';
                            break;
                    }
                    break;
                case 'log':
                    switch (operador) {
                        case 0:
                            val = '||';
                            break;
                        case 1:
                            val = '&&';
                            break;
                        case 2:
                            val = '!';
                            break;
                    }
                    break;
                case 'rel':
                    switch (operador) {
                        case 0:
                            val = '==';
                            break;
                        case 1:
                            val = '!=';
                            break;
                        case 2:
                            val = '>';
                            break;
                        case 3:
                            val = '<';
                            break;
                        case 4:
                            val = '>=';
                            break;
                        case 5:
                            val = '<=';
                            break;
                    }
                    break;
            }
            this.Lista.push(new Nodo_AST(val));
        }
        else
            this.Lista.push(new Nodo_AST(val));
    }
    //metoodo para agregar al arbol un dato
    agregarHijoAST(hijo) {
        if (hijo != undefined)
            this.Lista.push(hijo);
    }
    //metodo para obtener un valor
    getValor() {
        return this.valor;
    }
    //meotod para obtener el valor de un hijo
    getHijos() {
        return this.Lista;
    }
}
exports.default = Nodo_AST;
