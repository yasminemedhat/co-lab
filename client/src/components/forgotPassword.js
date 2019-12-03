import React, {Component} from "react";
import "../css/login.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";

class ForgotPassword extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      isSendingCode: false
    };
  }

  validateCodeForm() {
    return this.state.email.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };


  
  submit = e => {
    // todo: send email to BE
  }
 

  render() {
    return(
      <form onSubmit={this.handleSendCodeClick}>
        <span className="login100-form-title p-b-55">Reset Password</span>
            <div
              className="wrap-input100 validate-input m-b-16"
              data-validate="Valid email is required: ex@abc.xyz"
            >
              <input
                className="input100"
                type="text"
                name="email"
                placeholder="Email"
                value={this.state.email}
                onChange={this.handleChange}
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <span className="lnr lnr-envelope"></span>
              </span>
            </div>
            <div className="container-login100-form-btn p-t-25">
              <button type="submit" 
              className="login100-form-btn" 
              disabled={!this.validateCodeForm()}>Send code</button>
            </div>
        </form>
    );

  }
}

export default ForgotPassword;
