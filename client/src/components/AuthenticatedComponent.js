import React, {Component} from "react";
import {getJwt} from "../helpers/jwt";
import Axios from "axios";
import { withRouter } from "react-router-dom";
import Navbar from "./navbar";
import { logout } from '../utils/APICalls';

class AuthenticateComponent extends Component{
    

    constructor(props){
        super(props);
        this.state = {
            user: undefined,
        }
        this.logout = this.logout.bind(this);
        
    }

    // logout (){
    //     const jwt = getJwt();
    //     const headers = {
    //         Authorization: jwt
    //       }
    //     Axios.post('http://localhost:5000/user/logout', this.state.user, {headers: headers})
    //     .then((res)=> {
    //         this.setState({user: undefined});
    //         localStorage.removeItem('token');
    //         this.props.history.push('/login');
    //     })
    // }
    logout(){
        const jwt = getJwt();
        logout(jwt,this.state.user).then(res => {
            this.setState({user: undefined});
            localStorage.removeItem('token');
            this.props.history.push('/login');
        })
    }

    componentDidMount(){
        const jwt = getJwt();
        if(!jwt){
            this.props.history.push('/login');
        }
        Axios.get(process.env.REACT_APP_baseAPIURL+'/user/profile', {headers: { Authorization: jwt } })
        .then( (res) => {
            this.setState({user: res.data.user});

        }).catch(err => {
            localStorage.removeItem('token');
            this.props.history.push('/login');
        })
        
    }

    render(){
        const childrenWithProps = React.Children.map(this.props.children, child =>
            React.cloneElement(child, { user: this.state.user })
          );
        if(this.state.user === undefined){
            return(
            <div><h1>loading...</h1></div>
            );
        }
        return(
            <div>
                <Navbar logout={this.logout}
                        user = {this.state.user}/>
                <div>
                    {/* {this.props.children} */}
                    {childrenWithProps}
                </div> 
            </div>
                       
        );
    }


} 
export default withRouter(AuthenticateComponent);