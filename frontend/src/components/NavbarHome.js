import React from 'react';
// import {firebase, db} from '../config/firebase.js';

import {Navbar, Button, Nav} from 'react-bootstrap'
import {Link} from "react-router-dom";




export class NavbarHome extends React.Component{
    constructor(props){
        super(props);
        this.state = {};

    }


    render(){
        return(
        
                <Navbar  expand="lg" fixed="top" bg="dark" variant="dark">
                <Navbar.Brand as={Link} to="/profile">Smart Image Repository</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/all">Home</Nav.Link> 
                        <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                    </Nav>
                    <Nav className="justify-content-end">
                        <Button variant="danger" onClick={this.props.signOut}>Sign out</Button>
                    </Nav>
                </Navbar.Collapse>
                </Navbar>
            
        );
    }
}

