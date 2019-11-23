import React from 'react';
import "../css/main.css"
import "../bootstrap/css/bootstrap.min.css"
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css"
import "../fonts/Linearicons-Free-v1.0.0/icon-font.min.css"

import LoginForm from '../components/LoginForm.js';






class Login extends React.Component {

  constuctor() {
    this.super();
    this.routeChange = this.routeChange.bind(this);
  }
  routeChange = () => {
    let path = "/RegistrationPart1";
    this.props.history.push(path);
  };

  render() {


    return (
      <div>
      
        <div class="Limiter">
          <div class="main_container">
           
             <LoginForm></LoginForm>
             <div class="otherlogin">
            <span class="txt1">Not a member?</span>

            <button onClick={this.routeChange}>sign up </button>
          </div>

            

          </div>


        </div>
        
      </div>




    )

  }


}



export default Login;

