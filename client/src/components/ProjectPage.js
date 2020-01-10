import React, { Component } from "react";
import "../css/ProjectPage.css";
import "../css/createProject.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import Img from "react-image";
import { getProject, getUser } from "../utils/APICalls";
import { getJwt } from "../helpers/jwt";
import "../css/header.css";
import Image from 'react-bootstrap/Image'
import Can from "./Can";


class ProjectPage extends Component {
  
  constructor(props){
    super(props);
    this.state={
      loadingProject: true
    }
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  gotToCreatorProfile(){
    let path = "/users/"+this.state.creator._id;
        this.props.history.push({
        pathname : path
        });
  }
  componentDidMount() {
    const jwt = getJwt();
    console.log("params: ",this.props.match.params);
    getProject(jwt,this.props.match.params.id).then(data => {
      this.setState({
        project: data.project
      });
      getUser(jwt, this.state.project.creator)
        .then(data => {
          this.setState({
            creator: data.user, loadingProject: false
          })
        })
        .catch(err => {
          if (err && err.status) {
            alert("Creator not found: " + err.message);
          }
        })
    }).catch(err =>
      {
        alert("could not get project: ", err.message);
      });
}
 
  render() {
    const { loadingProject, project, creator } = this.state;
    
    if (loadingProject === true) {
      return (
        <div>
          <h1>loading...</h1>
        </div>
      );
    }
    let images = project.images ? project.images : []
    let row= [];
    let rowIndex = -1
    for (let i=0;i<images.length;i= i+3){
        rowIndex++
        row[rowIndex] = <div className="row imageRow" key={i}>
            <div className = "col imagecol">
            <Img className="project_pictures"  style={{ float: 'right'}} src={images[i]}></Img>
            </div>
            <div className = "col imagecol">
            <Img className="project_pictures" src={images[i+1]}></Img>
            </div>
            <div className = "col imagecol">
            <Img className="project_pictures" style={{ float: 'left'}} src={images[i+2]}></Img>
            </div>  
            </div>

    }
    
  return(<div className="ProjectContainer">
        <div >
          <div></div>
          <div>
            <div>
            {creator.avatar ? (<Image tag='a' onClick={()=>this.gotToCreatorProfile()} className="navbarAvatar" src={creator.avatar} style={{cursor: "pointer", width: 45, height: 45, margin:"5px"}} roundedCircle ></Image>) : (
            <Image tag='a' onClick={()=>this.gotToCreatorProfile()}  className="navbarAvatar" src={require("../images/profile.png")} style={{cursor: "pointer", width: 45, height: 45, margin:"5px"}} roundedCircle></Image>)}
               <div tag='a' onClick={()=>this.gotToCreatorProfile()} style={{cursor: "pointer"}}>{creator.firstName} {creator.lastName}</div>
            </div>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
          <p>{project.link}</p>
          </div>
          <div className="col">
           
          </div>
          
        </div>
        {
          row
        }
        
         
         
      </div>
    );
    
  }
}
export default ProjectPage;
