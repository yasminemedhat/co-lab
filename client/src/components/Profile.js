import React, { Component } from "react";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import Img from "react-image";
import ProjectPopup from "./ProjectPopup";
import axios from "axios";
import {getJwt} from "../helpers/jwt";

class Profile extends Component {
  state = {
    user: undefined,
    projects: []
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      imagePreviewURL: null,
      showPopup: false
    };
    this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
    this.createProject = this.createProject.bind(this);
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  // routeChange = () => {
  //   let path = "/CreateProject";
  //   const user = this.props.location.state.user;
  //   this.props.history.push({
  //     pathname: path,
  //     state: {
  //       user: user
  //     }
  //   });
  // };

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
      // email: this.props.location.state.user.email,
      // firstName: this.props.location.state.user.firstName,
      // lastName: this.props.location.state.user.lastName
      user: this.props.location.state.user
    });
  }

  createProject(project){
    // const { projectName, description, images, link } = newProject;

    // const project = {  name: projectName,
    //                    description: description,
    //                     images: images,
    //                     link: link };
    const jwt = getJwt();
    const path = '/profile';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': jwt
    }
    axios.post('http://localhost:5000/project/add', project,{headers:headers })
        .then((res) => {
            alert('Project created successfully!');
            // const user  = this.props.location.state.user;
            // this.props.history.push({
            //   pathname : path,
            //   state :{
            //   user: user,
            //   }
            //   });
            const projects = this.state.projects;
            projects.push(project)
            this.setState({projects});
      }).catch((e)=> {
            if (e.response && e.response.data) {
                alert("Could not create project: "+ e.response.data.message);
            }
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
    if(this.state.user === undefined){
      return(
      <div><h1>loading...</h1></div>
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
              <p>email: {this.state.user.email}</p>
              <p>phone:  {this.state.user.phone_number}</p>
              <p>Bio:  {this.state.user.bioghraphy}</p>
            </div>
          </div>

          <div className="col">
            <button
              className="profile-btn"
              onClick={this.togglePopup.bind(this)}
            >
              Add project
            </button>
            {this.state.showPopup ? (
              <ProjectPopup
                text='Click "Close Button" to hide popup'
                closePopup={this.togglePopup.bind(this)}
                createProject={this.createProject}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
