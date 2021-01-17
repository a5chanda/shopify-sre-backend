import React from 'react';
import {firebase, storage, db} from '../config/firebase.js';

import {Row, Col, Button, Card} from 'react-bootstrap'
import {Link} from "react-router-dom";




export class ImagesCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        };

    }


    render(){
        return(
            <Card style={{color: "black"}}>
            <Card.Img variant="top" src="holder.js/100px160" />
            <Card.Body>
                <Card.Title>Card title</Card.Title>
                <Card.Text>
                This is a wider card with supporting text below as a natural lead-in to
                additional content. This content is a little bit longer.
                </Card.Text>
            </Card.Body>
            <Card.Footer>
                <small className="text-muted">Last updated 3 mins ago</small>
            </Card.Footer>
            </Card>     
        );
    }
}

