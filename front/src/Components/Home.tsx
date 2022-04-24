import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Card,CardImg,Button} from 'react-bootstrap'
function Home(){
    return(
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}} >
        <Card border="dark" style={{ width: '50rem' }}>
        
        <Card.Body >
          <Card.Title>Compscript</Card.Title>
         
          <Card.Text>
            FACULTAD DE INGERIERÍA
          </Card.Text>
          <Card.Text>
            UNIVERSIDAD DE SAN CARLOS DE GUATEMALA
          </Card.Text>
          <Card.Text>
           SEGUNDO PROYECTO DE ORGANIZACION Y COMPILADORES 1
          </Card.Text>
          <Card.Text>
            PRIMER SEMESTRE 2022
          </Card.Text>
        </Card.Body>
      </Card>
        </div>
    );
}

export default Home;