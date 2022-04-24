import React,{ChangeEvent,ChangeEventHandler,useEffect,useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form,Button} from 'react-bootstrap'
import axios from 'axios'
import '../index.css'

function Compilador(){
    // data
   
    const [dato,setDato]=useState({
        exp:""
    });

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
    }


    return(
        <div>
            <div>
            <label id="labeltext">Área de Código</label>
            <textarea
            name="exp"
            rows={15} 
            cols={222}
            onChange={handleInputChange}
            
            >

            </textarea>
            </div>
            
            <div>
            <Button name="btn" onClick={sendData} variant="dark">Analizar Código</Button>
            </div>

            <div>
            <label>Área de Consola</label>
            <textarea
            name="res"
            rows={10} 
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