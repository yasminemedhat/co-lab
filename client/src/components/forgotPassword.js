import React, {Component} from "react";
import "../css/login.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import axios from "axios";


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


  
  sendCode = e => {
      const { email} = this.state;
      let path = "/login";
      console.log(email)
      axios.post('http://localhost:5000/user/resetPasswordRequest', {email: email})
          .then((res) => {
            alert(res.response.data);
            this.props.history.push(path);
            })
          .catch((e)=> {
              if (e.response && e.response.data) {
                  alert("Error: "+ e.response.data.message);
                  this.props.history.push('/forgotPassword');
              }
          });
          alert('please check your email to reset the password');
          this.props.history.push(path);
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
            <div className="container-login100-form-btn p-t-25">
              <button type="submit" 
              className="login100-form-btn">Send code</button>
            </div>
        </form>
    );

  }
}

export default ForgotPassword;
