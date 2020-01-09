import React, { Component } from "react";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import Image from 'react-bootstrap/Image'
import Can from "./Can";

import "../css/profile.css";
import ProjectPopup from "./ProjectPopup";
import CollaborationPopup from "./CollaborationPopup";
import ProjectLink from "./ProjectLink.js";
import ColabLink from "./ColabLink.js";
import { getJwt } from "../helpers/jwt";
import {
  createProject,
  getProjects,
  createCollaboration,
  getCollaborations,
  getUser
} from "../utils/APICalls";
import { Row, Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { AuthContext } from "../authContext";
import HorizontalScroll from 'react-scroll-horizontal'


class Profile extends Component {
  static contextType = AuthContext;

  // state = {
  //   user: this.context.user,
  //   projects: [{}],
  //   collaborations: [{}]
  // };

  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
      showPopup2: false,
      loadingProjects: true,
      loadingCollaborations: true,
      user: '',
      projects: [],
      collaborations: []
    };
    this.createProject = this.createProject.bind(this);
    this.createCollaboration = this.createCollaboration.bind(this);
    this.showColabDetails = this.showColabDetails.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
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

  showColabDetails = colab => {
    const path = "/collaborations/"+colab._id;
    this.props.history.push({
      pathname: path,
      state: {
        collaboration: colab
      }
    });
  };
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
    console.log("profile: props: ", this.props.match);
   getUser(this.context.accessToken, this.props.match.params.id)
        .then(data => {
          this.setState({
            user: data.user
          })
        })
        .catch(err => {
          if (err && err.status) {
            alert("User not found: " + err.message);
          }
        })
    
    // this.setState({
    //   user: this.context.user,
    //   authenticated: this.context.authenticated
    // });
      getProjects(this.context.accessToken,this.props.match.params.id)
        .then(data => {
          const projects = data;
          this.setState({ projects });
          this.setState({ loadingProjects: false });
        })
        .catch(err => {
          if (err && err.status) {
            alert("Couldn't get project: " + err.message);
          }
        });
    
      getCollaborations(this.context.accessToken,this.props.match.params.id)
        .then(data => {
          const collaborations = data;
          this.setState({ collaborations });
          this.setState({ loadingCollaborations: false });
        })
        .catch(err => {
          if (err && err.status) {
            alert("Could get collaborations: " + err.message);
          }
        });
    
    this.setState({ loadingCollaborations: false });
    this.setState({ loadingProjects: false });
    }

  createProject(formData) {
    this.setState({ loadingProjects: true });
    alert("Creating project please wait");
    const jwt = getJwt();
    createProject(jwt, formData)
      .then(res => {
        alert("Project created successfully!");
        // window.location.reload();
        let projects = this.state.projects;
        projects.unshift(res.data);
        this.setState({ projects });
      })
      .catch(err => {
        if (err && err.status) {
          alert("Could not create project: " + err.message);
        }
      });
    this.setState({ loadingProjects: false });
  }
  createCollaboration(formData) {
    this.setState({ loadingCollaborations: true });
    alert("Creating collaboration please wait");
    const jwt = getJwt();
    createCollaboration(jwt, formData)
      .then(res => {
        alert("Collaboration created successfully!");
        let collaborations = this.state.collaborations;
        collaborations.unshift(res.data);
        this.setState({ collaborations });
      })
      .catch(err => {
        if (err && err.status) {
          alert("Could not create collaboration: " + err.message);
        }
      });
    this.setState({ loadingCollaborations: false });
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
              {this.state.user.avatar ? (
                <Image className="profile" src={this.state.user.avatar} roundedCircle></Image>
              ) : (
                <Image className="profile" src={require("../images/profile.png")} roundedCircle></Image>
              )}
            </div>
          </Col>
          <Col>
            <div className="profile_info" style={{ float: "left" }}>
              <h4>
                {this.state.user.firstName} {this.state.user.lastName}
              </h4>

              <p>Email: {this.state.user.email}</p>
              {this.state.user.phone ? (
                <p>Phone: {this.state.user.phone}</p>
              ) : null}
              {this.state.user.biography ? (
                <p>biography: {this.state.user.biography}</p>
              ) : null}
              {this.state.user.phone ? (
                <p>Phone Number: {this.state.user.phone}</p>
              ) : null}
            </div>
          </Col>
        </Row>
        <Can role={this.context.user.userType} perform="projects:create" 
              data={{
                    userId: this.context.user.id,
                    profileOwnerId: this.props.match.params.id
                  }}
          yes={() => (
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
          )}
      />
        
        <h4 style={{ fontStyle: "bold", margin: "10px" }}>Projects </h4>
        <Row
          style={{
            width: "100%",
            height: "430px"
          }}
        >
          <div    style={{
            width: "2000px",
            height: "430px",
     
            
          }}>
            <HorizontalScroll
            className="horizontal_scroll"
             style={{
            
            
              overflow: "hidden",
              overflowX: "scroll",
              
            }}>
         
          <br></br>
        {this.state.loadingProjects ? (
            <div>
              <h5>Loading Projects...</h5>
            </div>
          ) : this.state.projects ? (
            // <div className="container">
        
            this.state.projects.map((project, i) => {
              // Return the element. Also pass key
              return (
                <Col key={i}
                style={{
                  width: "100%",
                  height: "430px"
                }}>
                  <ProjectLink key={i} project={project} />
                </Col>
              );
            })
            
          ) : null}
        </HorizontalScroll>
        </div>
        </Row>
        <Row style={{height: "30px"}}></Row>
        <Can role={this.context.user.userType} perform="collaborations:create" 
              data={{
                    userId: this.context.user.id,
                    profileOwnerId: this.props.match.params.id
                  }}
          yes={() => (
          <Row style={{ width: "100%" , marginTop: "20px"}}>
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
          </Row>)}/>

        <h4 style={{ fontStyle: "bold", margin: "10px" }}>Collaborations </h4>
        <Row
      
            style={{
              width: "100%",
              height: "430px"
            }}
       
        >
          <div    style={{
            width: "2000px",
            height: "430px",
     
            
          }}>
            <HorizontalScroll
            className="horizontal_scroll"
             style={{
            
            
              overflow: "hidden",
              overflowX: "scroll",
              
            }}>
          <br></br>
          {this.state.collaborations
            ? this.state.collaborations.map((colab, i) => {
                // Return the element. Also pass key
                return (
                  <Col key={i}>
                    <ColabLink
                      key={i}
                      collaboration={colab}
                      showDetails={this.showColabDetails}
                    />
                  </Col>
                );
              })
            : null}
              </HorizontalScroll>
        </div>
        </Row>
      </div>
    );
  }
}

export default withRouter(Profile);
