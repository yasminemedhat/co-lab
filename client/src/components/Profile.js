import React, { Component } from "react";
import "../css/profile.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import Img from 'react-image'


class Profile extends Component {
  render() {
    return (
      <div>
        <div className="Limiter">
          <div className="profile_container">
              <div className="image-container">
              <Img className="profile" src={require("../images/profile.png")}></Img>
              </div>
              <div className="profile_info">
            <p>email:</p>
            <p>phone:</p>
            <p>Bio:</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
