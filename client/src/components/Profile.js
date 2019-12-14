import React, { Component } from "react";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import Img from "react-image";
import ProjectPopup from "./ProjectPopup";
import ProjectLink from "./ProjectLink.js";
import { getJwt } from "../helpers/jwt";
import { createProject, getProjects } from "../utils/APICalls";
import {  Row, Col } from "react-bootstrap";

class Profile extends Component {
  state = {
    user: undefined,
    projects: [{}]
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      imagePreviewURL: null,
      showPopup: false
    };
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


  componentDidMount() {
    
      this.setState({
        user: this.props.location.state.user
      });
      
      const jwt = getJwt();
    getProjects(jwt)
    .then(res => {
      const projects = res;
      this.setState({projects});
    })
    .catch(err => {
      if (err && err.status) {
        alert("Could get project: " + err.message);
      }
    });
  }
    

  createProject(formData) {
    const jwt = getJwt();
    const path = "/profile";
    createProject(jwt,formData)
      .then(res => {
        alert("Project created successfully!");
        // var projects = this.state.projects;
        // projects.push(res.data);
        // this.setState({ projects });
        // const user  = this.props.location.state.user;
        // this.props.history.push({
        //   pathname : path,
        //   state :{
        //   user: user,
        //   }
        //   });
        window.location.reload();
      })
      .catch(err => {
        if (err && err.status) {
          alert("Could not create project: " + err.message);
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
    if (this.state.user === undefined) {
      return (
        <div>
          <h1>loading...</h1>
        </div>
      );
    }
    return (
     
        <div className="profile_container">
          <Row style={{ width: "100%" }}>
            <Col>
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
                <button
                  className="profile-btn"
                  onClick={this.fileUploadHandler}
                >
                  Uploade picture
                </button>
              </div>
            </Col>
            <Col>
              <div className="profile_info">
                <h1>
                  {this.state.firstName} {this.state.lastName}
                </h1>
                <p>email: {this.state.user.email}</p>
                <p>phone: {this.state.user.phone_number}</p>
                <p>Bio: {this.state.user.bioghraphy}</p>
              </div>
            </Col>

            <Col>
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
            </Col>
          </Row>
          <h4 style={{ fontStyle: "bold", margin: "10px" }}>Projects </h4>
          <Row style={{ width: "100%" }}>
          
            
              <br></br>
              {this.state.projects
                ? // <div className="container">
                  this.state.projects.map((project, i) => {
                    // Return the element. Also pass key
                    return <Col key={i}><ProjectLink key={i} project={project} /></Col>;
                  })
                : null}
     
          </Row>

        </div>

    );
  }
}

export default Profile;
