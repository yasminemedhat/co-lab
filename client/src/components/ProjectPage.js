import React, { Component } from "react";
import "../css/ProjectPage.css";
import "../css/createProject.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import { getProject, getUser, likeProject } from "../utils/APICalls";
import { getJwt } from "../helpers/jwt";
import "../css/header.css";
import Image from 'react-bootstrap/Image'
import Gallery from "react-grid-gallery";
import { AuthContext } from "../authContext";
import Can from "./Can";
import Toast from 'light-toast';
import { withRouter} from 'react-router-dom';

//import 'font-awesome/css/font-awesome.min.css';



class ProjectPage extends Component {
  static contextType = AuthContext;

  constructor(props){
    super(props);
    this.state={
      loadingProject: true,
      likeButton: true,
      likesCount: 0,
      project: {}
    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this.editProject = this.editProject.bind(this);
    this.toggleLikeProject = this.toggleLikeProject.bind(this);
  }

  gotToCreatorProfile(){
    let path = "/users/"+this.state.creator._id;
        this.props.history.push({
        pathname : path
        });
  }

  editProject = () =>{

    var path = "/projects/" + this.state.project._id + "/edit";
    this.props.history.push({
      pathname: path,
      state: {
        project: this.state.project
      }
     
    });
 }
 toggleLikeProject(){
  likeProject(this.context.accessToken, this.props.match.params.id)
  .then(project => {
    this.setState({likeButton: !this.state.likeButton})
    if(this.state.likeButton){
      this.setState({likesCount: this.state.likesCount -1})
    }else{
      this.setState({likesCount: this.state.likesCount+1})
    }
  })
  .catch(err => {
    if(err && err.status){
      Toast.fail("something went wrong",2000);
     // alert("something went wrong: " + err.message);
    }
  })
}

  componentDidMount() {
    const jwt = getJwt();
    getProject(jwt,this.props.match.params.id).then(data => {
      this.setState({
        project: data.project,
        likesCount: data.project.likes.length
      })
      if(data.project.likes.length> 0 && data.project.likes.includes(this.context.user._id)) {
        this.setState({likeButton: false});
      }
      else{
        this.setState({likeButton: true});
      }
      getUser(jwt, this.state.project.creator)
        .then(data => {
          this.setState({
            creator: data.user, loadingProject: false
          })
        })
        .catch(err => {
          if (err && err.status) {
            Toast.fail("Creator not found",2000);
           // alert("Creator not found: " + err.message);
          }
        })
    }).catch(err =>
      {
        //alert("could not get project: ", err);
        Toast.fail("Could not get project",2000);
      });
}
 
  render() {
    const { loadingProject, project, creator } = this.state;
     
    if(loadingProject === true)
    {
      return(
        <div>
         <h1>loading....</h1>
        </div>
      )
      
    }

   

  
   if (loadingProject === false)
   {
     Toast.hide()
     let images = project.images ? project.images : []
      let IMAGES = [{}]

      for (let i = 0; i <images.length; i ++) {
       IMAGES.push({src:images[i], thumbnail:images[i],
        
        thumbnailWidth: 250,
        thumbnailHeight: 212,})
      }
      IMAGES = IMAGES.slice(1,IMAGES.length)
      
      
    return(
       
    
          <div className="ProjectContainer">
           {
             Toast.hide()
           }
      
          <div >
          <div className="col">
          <Can role={this.context.user.userType} perform="projects:edit" 
              data={{
                    userId: this.context.user._id,
                    projectCreatorId: this.state.project.creator
                  }}
              yes={() => (
                      <button
                        style={{ float: "right", width: "180px" }}
                        className="profile-btn"
                        onClick={this.editProject}>
                        Edit Project
                      </button>
                  )}/>
         

            {this.state.likeButton=== true ? <button
              style={{ float: "right", width: "180px" }}
              className="profile-btn like__btn"
              onClick={this.toggleLikeProject}
            >
            <i className="like__icon fa fa-heart"></i>
            <span className="like__number">{this.state.likesCount}</span>
            </button> : <button
            style={{ float: "right", width: "180px" }}
            className="profile-btn unlike-button"
            onClick={this.toggleLikeProject}
          >
          <i className="liked__icon fa fa-heart"></i>
          <span className="like__number">{this.state.likesCount}</span>
          </button>}
          
          </div>
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
      
        
            
          </div>
          <Gallery images={IMAGES} backdropClosesModal ={true}  enableLightbox={true}
                      enableImageSelection={false} />
          
          
        </div>
      );
              }
    
  }
}
export default withRouter(ProjectPage);
