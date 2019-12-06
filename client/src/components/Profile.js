import React, { Component } from "react";
import "../css/profile.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import Img from "react-image";
import CreateProject from "./CreateProject";

class Profile extends Component {
  state = {
    email: "",
    firstName: "",
    lastName: ""
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      imagePreviewURL: null,
     
    };
    this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
  }

  routeChange = () => {
    let path = "/CreateProject";
    this.props.history.push(path);
  };


  fileSelectedHandler = event => {
    this.setState({
      selectedFile: event.target.files[0]
    });

    let reader = new FileReader();

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      });
    };

    reader.readAsDataURL(event.target.files[0]);
  };

  fileUploadHandler = () => {};
  componentDidMount() {
    this.setState({
      email: this.props.location.state.user.email,
      firstName: this.props.location.state.user.firstName,
      lastName: this.props.location.state.user.lastName
    });
  }

  render() {
    let { imagePreviewUrl } = this.state;
    let image = null;
    if (imagePreviewUrl) {
      image = <Img className="profile" src={imagePreviewUrl}></Img>;
    } else {
      image = (
        <Img className="profile" src={require("../images/profile.png")}></Img>
      );
    }
    return (
      <div className="  Container profile_container ">
        <div className="row" style={{ width: "100%" }}>
          <div className="col">
            <div className="">
              <div className="image-container">{image}</div>
            </div>

            <div className="row">
              <input
                style={{ display: "none" }}
                ref={fileInput => (this.fileInput = fileInput)}
                type="file"
                onChange={this.fileSelectedHandler}
              ></input>
              <button
                className="profile-btn"
                onClick={() => this.fileInput.click()}
              >
                Pick File
              </button>
              <button className="profile-btn" onClick={this.fileUploadHandler}>
                Uploade picture
              </button>
            </div>
          </div>
          <div className="col">
            <div className="profile_info">
              <h1>
                {this.state.firstName} {this.state.lastName}
              </h1>
              <p>email: {this.state.email}</p>
              <p>phone:</p>
              <p>Bio:</p>
            </div>
          </div>

          <div className="col">
            <button
              className="profile-btn"
              onClick={this.routeChange}
            >
              Add project
            </button>

          
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
