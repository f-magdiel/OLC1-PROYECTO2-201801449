import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Table,Button} from 'react-bootstrap'
import axios from 'axios';
import ast from '../assets/img/reporteAST.svg'
import '../index.css'

    function ReporteAST(){
        const graficar = async ()=>{

            const res = await axios.get('http://localhost:5000/graficarast')
            console.log(res.data)
        }
    
        return(
            <div>
                <div>
                <Button id={"btn"} onClick={graficar} variant="dark">Ver Arbol AST</Button>
                </div>
                <div className='image-container'>
                    <img src={ast} style={{ alignSelf: 'center' }} />
                </div>
            </div>
        );
    }
    

export default ReporteAST;