import React from 'react';
import {Button} from "react-bootstrap";
import {ImagesList} from '../components/ImagesList';

const DEV_URL="http://localhost:8000";

export class PublicPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            images: [] //array of images
        };
        this.fetchImages = this.fetchImages.bind(this);
    }
    
    fetchImages(){
        fetch(DEV_URL + '/getImages')
        .then(response => response.json())
        .then(data => {
            
            this.setState({images: data});
        });
    }

    componentDidMount(){
        this.fetchImages();
    }

    render() {
        return (
            <div>
                {/* <h1>HomePage</h1> */}
                {/* <Button onClick={this.fetchImages} > get images</Button>
                <Button variant="warning" onClick={this.props.signOut}>Sign out</Button> */}
                {this.state.images.length ?  <ImagesList images={this.state.images}/> : <></>} 
            </div>
        );
    }
}

