import React from 'react';
import "../css/main.css"
import "../bootstrap/css/bootstrap.min.css"
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css"
import "../fonts/Linearicons-Free-v1.0.0/icon-font.min.css"

import LoginForm from './LoginForm.js';
import { Link }  from "react-router-dom";
import { withRouter } from "react-router-dom";

import { login } from '../utils/APICalls';
import {AuthContext} from '../authContext';



class Login extends React.Component {
  static contextType = AuthContext;
  state={
    username: '',
    password: '',
    toProfile: false,
  }
  //Handle fields change
  handleChange = input => e => {
    e.preventDefault();
    this.setState({ [input]: e.target.value});
}
  constuctor(props) {
    this.routeChange = this.routeChange.bind(this);
    this.loginUser = this.loginUser.bind(this);
    console.log(props)
  }
  routeChange = () => {
    let path = "/RegistrationForm";
    this.props.history.push(path);
  };

  loginUser = () =>{
    const { email, password} = this.state;
    
    login(email, password)
          .then(data => {
              // localStorage.setItem('token',data.token);
              console.log("after login: ", data.user);
              this.context.initiateLogin(data);

              let path = "/users/"+data.user._id;
              this.props.history.push({
                pathname : path,
                state :{
                user: data.user,
                }
                });
          })
          .catch(error => {
              var errMsg='';
              if (error && error.status && error.status === 400) {
                  errMsg = "Incorrect username/password, please try again."
              }
              else {
                  errMsg = "Something went wrong, please try again later."
              }
              alert(errMsg);
             
          })
        }
    // axios.post('http://localhost:5000/user/login', credentials)
    //     .then((res) => {
            
    //         // this.props.history.push(path);
    //       })
    //     .catch((e)=> {
    //         if (e.response && e.response.data) {
    //             alert("Error: "+ e.response.data.message);
    //         }
    //     });
        
  

  render(props) {
    const {email, password} = this.state;
    const values = {email, password};
    

    return (
      <div>
        <div className="Limiter">
          <div className="main_container">
             <LoginForm
              sumbit = {this.loginUser}
              handleChange= {this.handleChange}
              values = {values}></LoginForm>
             <div className="otherlogin">
               <Link to='/forgotPassword'>Forgot password?</Link>
               <br></br>
            <span className="txt1">Not a member?</span>

            <button onClick={this.routeChange}>sign up </button>
          </div>

            

          </div>


        </div>
        
      </div>


    )

  }


}


export default withRouter(Login);

