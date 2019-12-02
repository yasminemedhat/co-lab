import React from 'react';
import "../css/main.css"
import "../bootstrap/css/bootstrap.min.css"
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css"
import "../fonts/Linearicons-Free-v1.0.0/icon-font.min.css"

import LoginForm from './LoginForm.js';
import { Link }  from "react-router-dom";
import axios from "axios";





class Login extends React.Component {

  state={
    username: '',
    password: '',
    toProfile: false,
  }
  //Handle fields change
  handleChange = input => e => {
    this.setState({ [input]: e.target.value});
}
  constuctor(props) {
    this.super();
    this.routeChange = this.routeChange.bind(this);
    this.loginUser = this.loginUser.bind(this);
  }
  routeChange = () => {
    let path = "/RegistrationForm";
    this.props.history.push(path);
  };

  loginUser = () =>{
    console.log("user is loogging");
    const { email, password} = this.state;
    const credentials = { email, password }
    let path = "/profile";
    axios.post('/user/login', credentials)
        .then((res) => {
            localStorage.setItem('token',res.data.token);
            this.props.history.push(path);
          })
        .catch((e)=> {
            if (e.response && e.response.data) {
                alert("Error: "+ e.response.data.message);
            }
        });
        
  }

  render() {
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
               <Link to='/'>Forgot password?</Link>
            <span className="txt1">Not a member?</span>

            <button onClick={this.routeChange}>sign up </button>
          </div>

            

          </div>


        </div>
        
      </div>




    )

  }


}



export default Login;

