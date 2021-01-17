import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom"
import {Button} from "react-bootstrap";
import {storage, db} from "../config/firebase";

import {NavbarHome} from "../components/NavbarHome";
import { Profile } from './Profile';




export class HomePage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            user: this.props.user
        };
    }


    render() {
        return (
            <div className="container">

                <Router>
                    <div>
                        <NavbarHome signOut={this.props.signOut}/>

                        <Switch>
                            <Route path="/profile">
                                <Profile user={this.props.user}/>
                            </Route>
                            <Route path="/all">
                                <h1>HomePage</h1>
                            </Route>
                        </Switch>
                    </div>
                </Router>



                
            
            </div>
        );
    }
}

