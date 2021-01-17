import React from 'react';

import {Spinner} from 'react-bootstrap'





export class LoadingComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {};

    }


    render(){
        return(
            <> 
                {this.props.isLoading ?  <Spinner animation="border" variant="warning" />  : <> </>}
            </>
        );
    }
}

