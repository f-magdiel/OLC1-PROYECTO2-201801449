export default class Nodo_AST {
    // nodo que almacena los valores del arbol

    //tipos de datos
    private Lista: Array<Nodo_AST>;
    private valor: string;
  
    //metodo constructor recibe un valor para inicializar
    constructor(valor: string) {
      this.Lista = new Array<Nodo_AST>();
      this.valor = valor;
    }

    //metodo para agregar un valor al arbol 
    public agregarHijo(val: string, ambito?: string, operador?: number): void {
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
      } else this.Lista.push(new Nodo_AST(val));
    }
    //metoodo para agregar al arbol un dato
    public agregarHijoAST(hijo: Nodo_AST | undefined): void {
      if (hijo != undefined) this.Lista.push(hijo);
    }

    //metodo para obtener un valor
    public getValor(): string {
      return this.valor;
    }

    //meotod para obtener el valor de un hijo
    public getHijos(): Array<Nodo_AST> {
      return this.Lista;
    }
  }
  