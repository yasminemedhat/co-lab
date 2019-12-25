import React, {Component} from "react";
import { withRouter, Redirect } from "react-router-dom";
import Navbar from "./navbar";
import {AuthContext} from '../authContext';

class AuthenticateComponent extends Component{
    static contextType = AuthContext;
    constructor(props){
        super(props);
        this.state= {isLoading: true};
        this.logout = this.logout.bind(this);
    }
    logout(){
        this.context.logout();
        
    }
    componentDidMount(){
       this.setState({isLoading: false});
    }
    render(){

        var content;
        if(this.state.isLoading){
            content =  (<div><h1>loading...</h1></div>)
        }
        else {
            content = this.context.authenticated ?
            <div><Navbar logout={this.logout}/>
                 <div>
                    {this.props.children}
                   
                </div></div> :  <Redirect to='/login'/>;
        }
                 
            return <div>{content}</div>
                       
        
    }
}
export default withRouter(AuthenticateComponent);