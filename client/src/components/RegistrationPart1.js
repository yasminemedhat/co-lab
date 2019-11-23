import React from "react";
import "../css/login.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "../fonts/Linearicons-Free-v1.0.0/icon-font.min.css";

class RegistrationPart1 extends React.Component {
  render() {
    return (

      <div className="Limiter">
      <div className="main_container">
      <div className="wrap-login100 p-l-50 p-r-50 p-t-77 p-b-30">
        <form className="login100-form validate-form">
          <span className="login100-form-title p-b-55">Registration (Part 1)</span>

          <div
            className="wrap-input100 validate-input m-b-16"
          >
            <input
              className="input100"
              type="text"
              name="username"
              placeholder="username"
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
              type="tel"
              name="phone"
              placeholder="phone"
            />
            <span className="focus-input100"></span>
            <span className="symbol-input100">
              <span className="lnr lnr-phone"></span>
            </span>
          </div>




          <div
            className="wrap-input100 validate-input m-b-16"
            data-validate="Valid email is required: ex@abc.xyz"
          >
            <input
              className="input100"
              type="text"
              name="email"
              placeholder="Email"
            />
            <span className="focus-input100"></span>
            <span className="symbol-input100">
              <span className="lnr lnr-envelope"></span>
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
              placeholder="Password"
            />
            <span className="focus-input100"></span>
            <span className="symbol-input100">
              <span className="lnr lnr-lock"></span>
            </span>
          </div>

          <div className="container-login100-form-btn p-t-25">
            <button className="login100-form-btn">next</button>
          </div>
        </form>
      </div>
      </div>
      </div>
    );
  }
}

export default RegistrationPart1;
