import React from 'react';
import {firebase, storage, db} from '../config/firebase.js';

import {Row, Col, Button, CardDeck, Card} from 'react-bootstrap'





export class ProfileImages extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            // user: this.props.user,
            images: this.props.images
        };
        this.imgCard = this.imgCard.bind(this);
        this.imgList = this.imgList.bind(this);
    }

    componentDidMount(){
        console.log(this.state);
    }

    imgCard(imgUri, imgKey){

        return(
            <Card key={imgKey} style={{color: "black", minWidth: "21rem", maxWidth:"21rem", minHeight:"21",marginBottom:"4%"}}>
            {/* <Card.Img variant="top" src="holder.js/100px160" /> */}
            <Card.Img variant="top" src={imgUri} style={{objectFit: "contain", height:"18rem"}} />
            {/* <Card.Body> 
                <Card.Title>Card title</Card.Title>
                <Card.Text>

                </Card.Text>
            </Card.Body> */}
            <Card.Footer>
                <Button variant="info" onClick={()=>{this.props.setPublicPrivate(imgKey, this.props.isPublic)}}>{ this.props.isPublic ? "Set Private" : "Set Public"  }</Button>
                <Button variant="danger" onClick={()=>{this.props.deleteImg(imgKey, this.props.isPublic)}}>Delete</Button>
                {/* <small className="text-muted">Last updated 3 mins ago</small> */}
            </Card.Footer>
            </Card>
        );
    }

    imgList(){
        console.log("here");
        let imgCards;
 
        imgCards = this.state.images.map( img => {
            let imgKey = Object.keys(img);
            return this.imgCard(img[imgKey[0]], imgKey[0]);
        });

        
        return (
        <CardDeck style={{justifyContent: "left"}}>
            {imgCards}
        </CardDeck>);
    }

    render(){
        return(
            <this.imgList/>
        );
    }
}

