import React, {Component} from "react";
import "../css/login.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import { changePassword } from "../utils/APICalls";


class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.handleChange= this.handleChange.bind(this);
    this.sendCode = this.sendCode.bind(this);
    this.validateCodeForm = this.validateCodeForm.bind(this);

    this.state = {
      email: ''
  }
  }
  validateCodeForm() {
    return this.state.email.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };


  
  sendCode = e => {
      e.preventDefault()
      const { email} = this.state;
      if (!this.validateCodeForm()) {
        return alert("All fields are required!");
      }

      let path = "/login";
      console.log(email)
      changePassword(email)
      .then((data) => {
            console.log("hiphiphorray");
            alert(data);
            this.props.history.push(path);
            })
      .catch((e)=> {
          if (e && e.message) {
              alert("Error: "+ e.message);
              this.props.history.push('/forgotPassword');
          }
      });
         
  }
 

  render() {
    return(
      <form onSubmit={this.sendCode}>
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
                required
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <span className="lnr lnr-envelope"></span>
              </span>
            </div>
            <div className="container-changePW-form-btn p-t-25">
              <button type="submit" 
              className="changePW-form-btn">Send code</button>
            </div>
        </form>
    );

  }
}

export default ForgotPassword;
