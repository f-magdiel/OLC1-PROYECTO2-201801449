export default class Errores {
  //tipos de datos
    private tipo: String;
    private description: String;
    private fila: number;
    private columna: number;
  
     //metodo constructor
     constructor(tipo: String, description: String, fila: number, columna: number) {//este es el constructor.
      this.tipo = tipo;
      this.description = description;
      this.fila = fila;
      this.columna = columna;
    }

    //meotodo para obtener un tipo de error
    public gettipo(): String {
      return this.tipo;
    }
    //metodo para obtener descriptionripcion
    public getdescription(): String {
      return this.description;
    }

     //metodo para obtener el # de fila
     public getFila(): number {
      return this.fila;
    }

    //meotod para obtener el # de columna
    public getcolumna(): number {
      return this.columna;
    }

    //metodo para retornar el error como un objeto
    public returnError(): String {
      return (
        'Se obtuvo: ' +
        this.tipo +
        ' description:{' +
        this.description +
        '} en la fila: ' +
        this.fila +
        ' en la columna: ' +
        this.columna +
        '\n'
      );
    }
  }
  