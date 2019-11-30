import React, {Component} from "react";
import "../css/login.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";

class UserBasicForm extends Component {
  
  continue = e => {
    e.preventDefault();
    const values = this.props.values;
    if(values.email.length === 0 || values.username.length === 0 || values.firstname.length === 0 || values.lastname.length === 0
      || values.password.length === 0){
      alert("All fields are required!");
    }else{
      this.props.nextStep();
    }
    
  }


  
  render() {
    const { values } = this.props;
    return (
      <div className="main_container">
        <div className="wrap-login100 p-l-50 p-r-50 p-t-77 p-b-30">
          <form className="login100-form validate-form">
            <span className="login100-form-title p-b-55">Basic Information</span>

            <div
              className="wrap-input100 validate-input m-b-16"
              data-validate="Valid email is required: ex@abc.xyz">
              <input
                className="input100"
                type="text"
                required
                name="email"
                placeholder="Email"
                onChange={this.props.handleChange('email')}
                defaultValue = {values.email}
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <span className="lnr lnr-envelope"></span>
              </span>
            </div>


            <div
              className="wrap-input100 validate-input m-b-16"
            >
              <input
                className="input100"
                type="text"
                required
                name="username"
                placeholder="username"
                onChange={this.props.handleChange('username')}
                defaultValue = {values.username}
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <span className="lnr lnr-user"></span>
              </span>
            </div>

            <div
              className="wrap-input100 validate-input m-b-16"
            >
              <input
                className="input100"
                type="text"
                required
                name="firstname"
                placeholder="first name"
                onChange={this.props.handleChange('firstname')}
                defaultValue = {values.firstname}
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <span className="lnr lnr-user"></span>
              </span>
            </div>

            <div className="wrap-input100 validate-input m-b-16">
              <input
                className="input100"
                type="text"
                name="lastname"
                placeholder="last name"
                required = "required"
                onChange={this.props.handleChange('lastname')}
                defaultValue = {values.lastname}
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <span className="lnr lnr-user"></span>
              </span>
            </div>

            <div
              className="wrap-input100 validate-input m-b-16"
              data-validate="Password is required"
            >
              <input
                className="input100"
                type="password"
                name="pass"
                required
                placeholder="Password"
                onChange={this.props.handleChange('password')}
                defaultValue = {values.password}
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <span className="lnr lnr-lock"></span>
              </span>
            </div>

            <div className="wrap-input100 validate-input m-b-16">
              <input
                className="input100"
                type="tel"
                name="phone"
                placeholder="phone"
                onChange={this.props.handleChange('phone')}
                defaultValue = {values.phone}
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <span className="lnr lnr-phone"></span>
              </span>
            </div>


            <div className="wrap-input100 validate-input m-b-16">
              <select className ="browser-default custom-select">
                {values.Interests.map((interest => <option key={interest.value} value={interest.value}>{interest.display}</option>))}
              
              </select>
            </div>


            <div className="container-login100-form-btn p-t-25">
              <input type="submit" className="login100-form-btn" value="Save and continue" onClick={this.continue}/>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default UserBasicForm;
