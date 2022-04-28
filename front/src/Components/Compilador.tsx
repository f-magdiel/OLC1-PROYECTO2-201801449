import React,{ChangeEvent,ChangeEventHandler,useEffect,useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form,Button} from 'react-bootstrap'
import axios from 'axios'
import '../index.css'

interface Data {
    exp:string | undefined | ArrayBuffer|null
  }
function Compilador(){
    // data
   
    const [dato,setDato]=useState<Data>({
        exp:""
    });

    const [texto,setTexto] = useState<string | ArrayBuffer| null>('')

    const [dato1,setDato1]=useState({
        res:""
    });

    const [respuesta,setRespuesta] = useState({
        errores:[],
        resultado:"",
        tabla:[]
    })

    const handleInputChange =({
        target:{name,value},
    }:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
        setDato({exp:value})
    }

    const handleOutputChange = ({
        target:{name,value},
    }:ChangeEvent<HTMLTextAreaElement>)=>{
        setDato1({res:respuesta.resultado})
    }


    const readFile = (e:any) =>{
        const file = e.target.files[0]
        const fileReader = new FileReader()

        fileReader.readAsText(file)
        if(!file) return; // si no carga nada pero abrir el explorador 

        //carga al areatexto el contenido del archivo
        fileReader.onload= ()=>{
        setDato({exp:fileReader.result})          
        }

        //si me da error
        fileReader.onerror = ()=>{
            console.log(fileReader.onerror)
        }
    }
    

    //enviar datos al backend
    const sendData = async()=>{
        const res = await axios.post('http://localhost:5000/Interpretar',{"exp":dato.exp},{
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              }
        })
        
        //devolucion en json
        respuesta.errores = res.data.errores
        respuesta.resultado = res.data.resultado
        respuesta.tabla = res.data.tabla
        setDato1({res:respuesta.resultado})
        console.log(res.data)
    }


    return(
        <div>
            <div>
            <label id="labeltext">Área de Código</label>
            <textarea
            name="exp"
            rows={20} 
            cols={222}
            onChange={handleInputChange}
            value={dato.exp?.toString()}
            >

            </textarea>
            </div>
            <div>
            <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Para cargar archivos</Form.Label>
            <Form.Control onChange={readFile} type="file" size="sm" />
            </Form.Group>
            </div>
            <div className='botones'>
            <Button name="btn" onClick={sendData} variant="dark">Analizar Código</Button>
            </div>
            

            <div>
            <label>Área de Consola</label>
            <textarea
            name="res"
            rows={15} 
            cols={222}
            onChange={handleOutputChange}
            value={dato1.res}
            >

            </textarea>
            </div>
            
        </div>
       

           
        
    );
}

export default Compilador;