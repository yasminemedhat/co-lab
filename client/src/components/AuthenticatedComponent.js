import React, {Component} from "react";
import {getJwt} from "../helpers/jwt";
import Axios from "axios";
import { Redirect } from "react-router-dom";

class AuthenticateComponent extends Component{
    

    constructor(props){
        super(props);
        this.state = {
            user: undefined,
        }
    }


    componentWillMount(){
        const jwt = getJwt();
        if(!jwt){
            this.props.history.push('./login');
        }

        Axios.get('/profile', {headers: { Authorization: jwt } })
        .then( (res) => {
            this.setState({user: res.data});
        }).catch(err => {
            console.log("auth ", err.data);
            localStorage.removeItem('jwt');
            window.location='/login';
        })
        const user = {email: "bla"}
        this.setState({user: user});
        
    }

    render(){
        console.log('user' + this.state.user);
        if(this.state.user === undefined){
            return(
            //     <Redirect
            //     to={{
            //       pathname: "/login",
            //       state: { from: this.props.location }
            //     }}
            //   />
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
export default AuthenticateComponent;