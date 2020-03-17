import React, { Component } from "react";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import Image from "react-bootstrap/Image";
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
  getCollaboration,
  getUser,
  followUser
} from "../utils/APICalls";
import { Row, Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { AuthContext } from "../authContext";
import HorizontalScroll from "react-scroll-horizontal";

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
      user: "",
      projects: [],
      collaborations: [],
      followButton: true
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
    const path = "/collaborations/" + colab._id;
    getCollaboration(this.context.accessToken, colab._id).then(data => {
      this.props.history.push({
        pathname: path,
        state: {
          collaboration: data
        }
      });
    });
  };

  toggleFollowUser() {
    followUser(this.context.accessToken, this.props.match.params.id)
      .then(data => {
        this.setState({ followButton: !this.state.followButton });
        this.context.updateUser();
      })
      .catch(err => {
        if (err && err.status) {
          alert("something went wrong: " + err.message);
        }
      });
  }

  followButton() {
    if (this.context.user.following.includes(this.props.match.params.id)) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    getUser(this.context.accessToken, this.props.match.params.id)
      .then(data => {
        this.setState({
          user: data.user
        });
      })
      .catch(err => {
        if (err && err.status) {
          alert("User not found: " + err.message);
        }
      });
    if (this.context.user.following) {
      if (this.context.user.following.includes(this.props.match.params.id)) {
        this.setState({ followButton: false });
      }
    }

    // this.setState({
    //   user: this.context.user,
    //   authenticated: this.context.authenticated
    // });
    getProjects(this.context.accessToken, this.props.match.params.id)
      .then(data => {
        const projects = data;
        this.setState({ projects });
        this.setState({
          loadingProjects: false,
          projectsNumber: projects.length
        });
      })
      .catch(err => {
        if (err && err.status) {
          alert("Couldn't get project: " + err.message);
        }
      });

    getCollaborations(this.context.accessToken, this.props.match.params.id)
      .then(data => {
        const collaborations = data;
        this.setState({ collaborations });
        this.setState({
          loadingCollaborations: false,
          colabsNumber: collaborations.length
        });
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

    const jwt = getJwt();
    createProject(jwt, formData)
      .then(res => {
        alert("Project created successfully!");
        let projects = this.state.projects;
        projects.unshift(res.data);
        this.setState({ projects: projects });
        this.setState({ loadingProjects: false });

        this.forceUpdate();
      })
      .catch(err => {
        if (err && err.status) {
          alert("Could not create project: " + err.message);
        }
      });
  }
  createCollaboration(formData) {
    this.setState({ loadingCollaborations: true });
    const jwt = getJwt();
    createCollaboration(jwt, formData)
      .then(res => {
        alert("Collaboration created successfully!");
        let collaborations = this.state.collaborations;
        collaborations.unshift(res.data);
        this.setState({ collaborations: collaborations });
        this.setState({ loadingCollaborations: false });
        this.forceUpdate();
      })
      .catch(err => {
        if (err && err.status) {
          alert("Could not create collaboration: " + err.message);
        }
      });
    // this.setState({ loadingCollaborations: false });
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
                <Image
                  className="profile"
                  style={{ margin: "2%" }}
                  src={this.state.user.avatar}
                  roundedCircle
                ></Image>
              ) : (
                <Image
                  className="profile"
                  style={{ margin: "2%" }}
                  src={require("../images/profile.png")}
                  roundedCircle
                ></Image>
              )}
            </div>
            <Can
              role={this.context.user.userType}
              perform="users:follow"
              data={{
                userId: this.context.user._id,
                profileOwnerId: this.props.match.params.id
              }}
              yes={() => (
                <div className="follow-button">
                  {this.state.followButton ? (
                    <button
                      className="follow-btn"
                      onClick={() => this.toggleFollowUser()}
                    >
                      follow
                    </button>
                  ) : (
                    <button
                      className="unfollow-btn"
                      onClick={() => this.toggleFollowUser()}
                    >
                      unfollow
                    </button>
                  )}
                </div>
              )}
            />
          </Col>
          <Col>
            <div className="profile_info" style={{ float: "left" }}>
              <h4>
                {this.state.user.firstName} {this.state.user.lastName}
              </h4>

              <p>Email: {this.state.user.email}</p>

              {this.state.user.biography ? (
                <p>biography: {this.state.user.biography}</p>
              ) : null}
              {this.state.user.phone ? (
                <p>Phone Number: {this.state.user.phone}</p>
              ) : null}

              {this.state.user.workingField ? (
                <p>working Field: {this.state.user.workingField}</p>
              ) : null}
            </div>
          </Col>
        </Row>
        <Can
          role={this.context.user.userType}
          perform="projects:create"
          data={{
            userId: this.context.user._id,
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

        <div className="scrolling-wrapper">
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
                  <div className="col-card"
                    key={i}
                  
                  >
                    <ProjectLink key={i} project={project} />
                  </div>
                );
              })
            ) : null}
   
        </div>

        <Can
          role={this.context.user.userType}
          perform="collaborations:create"
          data={{
            userId: this.context.user._id,
            profileOwnerId: this.props.match.params.id
          }}
          yes={() => (
            <Row style={{ width: "100%", marginTop: "20px" }}>
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
          )}
        />

        <h4 style={{ fontStyle: "bold", margin: "10px" }}>Collaborations </h4>
        <div className="scrolling-wrapper">
          <br></br>
         
            {this.state.loadingCollaborations ? (
              <div>
                <h5>Loading Collaborations...</h5>
              </div>
            ) : this.state.collaborations ? (
              this.state.collaborations.map((colab, i) => {
                // Return the element. Also pass key
                return (
                  <div className="col-card"
                    key={i}
                    style={{
                      width: "100%",
                      height: "460px"
                    }}
                  >
                    <ColabLink
                      key={i}
                      collaboration={colab}
                      showDetails={this.showColabDetails}
                    />
                  </div>
                );
              })
            ) : null}
       
        </div>
      </div>
    );
  }
}

export default withRouter(Profile);
