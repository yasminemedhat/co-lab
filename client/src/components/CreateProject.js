import React, { Component } from "react";
import "../css/profile.css";
import "../css/createProject.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import Img from "react-image";
import axios from "axios";
import {getJwt} from "../helpers/jwt";


class CreateProject extends Component {
  state = {
    projectName: "",
    description: "",
    creator: ""
  };
  fileObj = [];
  fileArray = [];

  constructor(props) {
    super(props);
    this.state = {
      file: [null]
    };
    this.createProject = this.createProject.bind(this);
    this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  uploadMultipleFiles(e) {
    this.fileObj.push(e.target.files);
    for (let i = 0; i < this.fileObj[0].length; i++) {
      this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]));
    }
    this.setState({ file: this.fileArray });
  }

  uploadFiles(e) {
    e.preventDefault();
    console.log(this.state.file);
  }

  //Handle fields change
  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };

  createProject(){
    const { projectName, description } = this.state;
    console.log(projectName);

    const project = {  name: projectName,
                       description: description };
    const jwt = getJwt();
    const path = '/profile';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': jwt
    }
    axios.post('http://localhost:5000/project/add', project,{headers:headers })
        .then((res) => {
            alert('Project created successfully!');
            const user  = this.props.location.state.user;
            this.props.history.push({
              pathname : path,
              state :{
              user: user,
              }
              });
      }).catch((e)=> {
            if (e.response && e.response.data) {
                alert("Could not create project: "+ e.response.data.message);
            }
        });
  }
  render() {
    let images = null;
    let row= [];
    let rowIndex = -1
    for (let i=0;i<this.state.file.length;i= i+3){
        rowIndex++
        row[rowIndex] = <div className="row imageRow">
            <div className = "col imagecol">
            <Img className="pictures" src={this.fileArray[i]}></Img>
            </div>
            <div className = "col imagecol">
            <Img className="pictures" src={this.fileArray[i+1]}></Img>
            </div>
            <div className = "col imagecol">
            <Img className="pictures" src={this.fileArray[i+2]}></Img>
            </div>  
            </div>

    }

  


    return (
      <div className="  Container projectContainer ">
        <div className="row">
          <div className="col"></div>
          <div className="col">
            <input
              type="text"
              placeholder="Project Name"
              value={this.state.projectName}
              onChange={this.handleChange("projectName")}
            />
            <br></br>
            <hr></hr>
            <textarea
              className="description"
              value={this.state.description}
              onChange={this.handleChange("description")}
              placeholder="Project Description"
            />
          </div>
          <div className="col">
            <input
              multiple
              style={{ display: "none" }}
              ref={fileInput => (this.fileInput = fileInput)}
              type="file"
              onChange={this.uploadMultipleFiles}
            ></input>
            <button
              className="profile-btn"
              onClick={() => this.fileInput.click()}
            >
              Add Pictures
            </button>
            <button className="profile-btn"onClick={this.uploadFiles}>
              Uploade picture
            </button>
          </div>
          
        </div>
         <div className="imageContainer">
         
          { 
            
              row
          }
          
          </div>
          <button className="btn btn-primary float-right" onClick={this.createProject}>Create</button>
         
      </div>
    );
  }
}
export default CreateProject;
