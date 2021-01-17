import React from 'react';
import './App.css';
import {providers, firebaseAppAuth, db} from './config/firebase.js';
import 'firebase/auth';
import withFirebaseAuth from 'react-with-firebase-auth';

import {HomePage} from "./pages/Homepage";
import {PublicPage} from "./pages/PublicPage";

import {Navbar, Button, Nav} from 'react-bootstrap'
import {Link} from "react-router-dom";

import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom"

class App extends React.Component {

   
    render() {
        const {
            user,
            signOut,  
            signInWithEmailAndPassword,
            createUserWithEmailAndPassword,
            signInWithGoogle,
        } = this.props;

        let SignUpFunction = () => {

        }

        let SignInFunction = () => {
            // signInWithGoogle().then((result) => {
            //     console.log(result);
            //     //db.collection('users').doc(cr)
            // });

            firebaseAppAuth.signInWithPopup(providers.googleProvider).then((result) =>{
                console.log(result);
                //move to server side to check if user exists
                db.collection('users').doc(result.user.uid).set({
                       name: result.user.displayName,
                       uid: result.user.uid
                });

    


            });
        }
        
        let SignUp = () =>{

        }

        let SignIn = () => (
            <div style={{textAlign: "center", width: "100%", marginTop: "30vh" }}> 
                <section>
                    {/* <img src={logo} alt="Quicktab Logo"/> */}
                </section>
                <h2 className=" mt-5">Smart Image Repository</h2>
                {/* <h4>Please sign in</h4> */}
                <button type="button" 
                        style ={{"backgroundColor" : "#ecB22a", "borderRadius": "17px", "padding" : "15px 75px", color: "#2d3037"}} 
                        className="btn mt-3" 
                        onClick={SignInFunction}>
                            <b>Sign in with Google</b>
                </button>
                
                <button type="button" 
                        style ={{"backgroundColor" : "#ecB22a", "borderRadius": "17px", "padding" : "15px 75px", color: "#2d3037"}} 
                        className="btn mt-3" 
                        onClick={SignInFunction}>
                            <b>Sign in with Google</b>
                </button>
            </div>
            
        );

        return (
            <div className="App">
            <section className="App-header">
                {/* <SignIn/> */}
                {user ? <HomePage user={user} signOut={signOut}/> : 
                
                <> 
                
                <Router >
                     <div style={{display: "flex", alignItems: "center"}}>
                    <Navbar  expand="lg" fixed="top" bg="dark" variant="dark">
                    <Navbar.Brand as={Link} to="/">Smart Image Repository</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                           
                        </Nav>
                        <Nav className="justify-content-end">
                            {/* <Button variant="warning" onClick={this.props.signOut}>Sign out</Button> */}
                            <Button variant="warning" onClick={SignInFunction}>Sign In With Google</Button>
                        </Nav>
                    </Navbar.Collapse>
                    </Navbar>

                        <Switch>
                            <Route path="/">
                                <PublicPage/>
                            </Route>
                        </Switch>
                    </div>
                </Router>
               
                
                
                
                </>
                }
                
    
            </section>
            </div>
        );
    }
  }

export default withFirebaseAuth({
    providers,
    firebaseAppAuth,
  })(App);
