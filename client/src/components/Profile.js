import React, { Component } from "react";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import Img from "react-image";
import ProjectPopup from "./ProjectPopup";
import CollaborationPopup from "./CollaborationPopup";
import ProjectLink from "./ProjectLink.js";
import { getJwt } from "../helpers/jwt";
import { createProject, getProjects,getUser, createCollaboration } from "../utils/APICalls";
import {  Row, Col } from "react-bootstrap";
import { withRouter} from 'react-router-dom';

class Profile extends Component {
  state = {
    user: undefined,
    projects: [{}],
    collaborations: [{}]
  };

  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
      showPopup2: false
    };
    this.createProject = this.createProject.bind(this);
    this.createCollaboration = this.createCollaboration.bind(this);
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }
  togglePopup2() {
    this.setState({
      showPopup2: !this.state.showPopup2
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
    const jwt = getJwt();
    getUser(jwt).then(data => {
        console.log("comp did mount: ", data.user);
        this.setState({user: data.user})
        console.log("state: ",this.state.user);
      })
      .catch(err => {
        if (err && err.status) {
          alert("Could not get user: " + err.message);
        }
      });
      // this.setState({
      //   user: this.props.location.state.user
      // });
      
      // const jwt = getJwt();
      
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
    // getCollaborations(jwt)
    // .then(res => {
    //   const collaborations = res;
    //   this.setState({collaborations});
    // })
    // .catch(err => {
    //   if (err && err.status) {
    //     alert("Could get collaborations: " + err.message);
    //   }
    // });
  }
    

  createProject(formData) {
    const jwt = getJwt();
    createProject(jwt,formData)
      .then(res => {
        alert("Project created successfully!");
        window.location.reload();
      })
      .catch(err => {
        if (err && err.status) {
          alert("Could not create project: " + err.message);
        }
      });
  }
  createCollaboration(formData) {
    const jwt = getJwt();
    createCollaboration(jwt,formData)
      .then(res => {
        alert("Collaboration created successfully!");
        window.location.reload();
      })
      .catch(err => {
        if (err && err.status) {
          alert("Could not create collaboration: " + err.message);
        }
      });
  }

  render() {
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

              <div className="row">
                { this.state.user.avatar ? (<Img className="profile" src={this.state.user.avatar}></Img>)
                  : (<Img className="profile" src={require("../images/profile.png")}></Img>)}
                </div>
              </Col>
              <Col>
              <div className="profile_info" style={{ float: "left" }}>
                <h4>
                  {this.state.user.firstName} {this.state.user.lastName}
                </h4>
                
                <p>Email: {this.state.user.email}</p>
                {this.state.user.phone ? (<p>Phone: {this.state.user.phone}</p>) : null}
                {this.state.user.biography ? (<p>biography: {this.state.user.biography}</p>) : null}
                {this.state.user.phone ? (<p>Phone Number: {this.state.user.phone}</p>) : null}
              </div>
              </Col>
            </Row>
            
          
            <Row style={{ width: "100%" }}>
              <Col>
              <button
                style={{ float: "right", width: "180px" }}
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
          <Row style={{ width: "100%" }}>
              <Col>
              <button
                style={{ float: "right", width: "180px" }}
                className="profile-btn"
                onClick={this.togglePopup2.bind(this)}
              >
                Add Co-Laboration
              </button>
              {this.state.showPopup2 ? (
                <CollaborationPopup
                  text='Click "Close Button" to hide popup'
                  closePopup2={this.togglePopup2.bind(this)}
                  createCollaboration={this.createCollaboration}
                 
                />
              ) : null}
              </Col>
          </Row>

        </div>

    );
  }
}

export default withRouter(Profile);
