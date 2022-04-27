export default class Tipo {
  //variable para el tipo de datos
    private tipos: tipoDato;

    //el metodo constructor
    constructor(tipos: tipoDato) {
      this.tipos = tipos;
    }

    //getter y setter
    public igual(compara: Tipo) {
      return (this.tipos = compara.tipos);
    }
    public setTipo(tipo: tipoDato): void {
      this.tipos = tipo;
    }
    public getTipo(): tipoDato {
      return this.tipos;
    }
    
    
  }
  
  export enum tipoDato {
    ENTERO,
    DECIMAL,
    BOOLEANO,
    CARACTER,
    CADENA,
    VOID,
  }
  