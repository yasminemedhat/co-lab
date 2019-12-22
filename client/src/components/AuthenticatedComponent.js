import React, {Component} from "react";
import {getJwt} from "../helpers/jwt";
import Axios from "axios";
import { withRouter } from "react-router-dom";
import Navbar from "./navbar";
import { logout } from '../utils/APICalls';
import {AuthContext} from '../authContext';
import Login from './Login';

class AuthenticateComponent extends Component{
    static contextType = AuthContext;
    constructor(props){
        super(props);
        this.logout = this.logout.bind(this);
    }
    logout(){
        this.context.logout();
        
    }
    render(){
        let value = this.context.authenticated ?
        <div><Navbar logout={this.logout}/>
                 <div>
                    {this.props.children}
                   
                </div></div> : <Login></Login>;
                 
            return <div>{value}</div>
                       
        
    }
}
export default withRouter(AuthenticateComponent);