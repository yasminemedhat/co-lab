import React, { Component } from "react";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import Img from "react-image";
import ProjectPopup from "./ProjectPopup";
import ProjectLink from "./ProjectLink.js";
import {getJwt} from "../helpers/jwt";
import { createProject } from '../utils/APICalls';

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
    const projects = [{
      name: "my first project",
      description: "best project evaaa",
    },{
      name: "my second project",
      description: "best second project evaaa",
    }
  ];
    this.state = {
      projects: projects
    };
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
    //  to do: get projects of the user set state
    this.setState({
      // email: this.props.location.state.user.email,
      // firstName: this.props.location.state.user.firstName,
      // lastName: this.props.location.state.user.lastName

      user: this.props.location.state.user,
      
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
    // 
    createProject(jwt, project).then(res => {
      alert('Project created successfully!');
      const projects = this.state.projects;
      projects.push(project)
      this.setState({projects});
       // const user  = this.props.location.state.user;
            // this.props.history.push({
            //   pathname : path,
            //   state :{
            //   user: user,
            //   }
            //   });
    }).catch((e)=> {
            if (e && e.data) {
                alert("Could not create project: "+ e.data.message);
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
      <div>
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
          <div className="col-4">
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
      <div className="row Container profile_container">
      <h4 style={{fontStyle: "bold", margin: "10px"}}>Projects  </h4>
      <br></br>
      {this.state.projects.length > 0 ? 
        // <div className="container">
        this.state.projects.map((project, i) => {                     
            // Return the element. Also pass key     
            return(<ProjectLink key={i} project={project} />)
      }): null}
    </div>
    </div>
    );
  }
}

export default Profile;
