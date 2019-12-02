import React, {Component} from "react";
import {getJwt} from "../helpers/jwt";
import Axios from "axios";
import { withRouter } from "react-router-dom";

class AuthenticateComponent extends Component{
    

    constructor(props){
        super(props);
        this.state = {
            user: undefined,
        }
    }


    componentDidMount(){
        const jwt = getJwt();
        if(!jwt){
            this.props.history.push('/login');
        }

        Axios.get('http://localhost:5000/user/profile', {headers: { Authorization: jwt } })
        .then( (res) => {
            this.setState({user: res.data});

        }).catch(err => {
            localStorage.removeItem('token');
            this.props.history.push('/login');
        })
        
    }

    render(){
        if(this.state.user === undefined){
            return(
            <div><h1>loading...</h1></div>
            );
        }
        return(
            <div>
                {this.props.children}
            </div>            
        );
    }


} 
export default withRouter(AuthenticateComponent);