import React from 'react';
import {firebase, storage, db} from '../config/firebase.js';

import {Row, Col, Button, CardDeck, Card} from 'react-bootstrap'





export class ImagesList extends React.Component{
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

    imgCard(imgUri){

        return(
            <Card style={{color: "black", minWidth: "21rem", maxWidth:"21rem", marginBottom:"4%"}}>
            {/* <Card.Img variant="top" src="holder.js/100px160" /> */}
            <Card.Img variant="top" src={imgUri}/>
            </Card>
        );
    }

    imgList(){
        console.log("here");
        let imgCards;
        if(!Array.isArray(this.state.images)){
            imgCards = this.state.images.map( img => {
                let imgKey = Object.keys(img);
                return this.imgCard(img[imgKey[0]]);
             });
        }
        else{
            
            imgCards = this.state.images.map( img => {
                return this.imgCard(img);
             });
        }
        
        return (
        <CardDeck style={{justifyContent: "center"}}>
            {imgCards}
        </CardDeck>);
    }

    render(){
        return(
            <this.imgList/>
        );
    }
}

