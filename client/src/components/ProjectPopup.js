import React, { Component } from "react";
import Modal from "react-awesome-modal";
import Img from "react-image";
import "../css/projectPopup.css";
import "../css/profile.css";
import Linkify from "react-linkify";
import { photosStore } from "./store";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import ProjectPhotos from "./ProjectPhotos";

export default class ProjectPopup extends Component {
  state = {
    projectName: "",
    description: "",
    creator: "",
    projectLink: "",
    images: []
  };
  fileObj = [];
  fileArray = [];
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      file: [null]
    };
    this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCreateProject = this.handleCreateProject.bind(this);
  }

  uploadMultipleFiles(e) {
    this.fileObj = [];
    this.fileArray = [];
    this.fileObj.push(e.target.files);
    for (let i = 0; i < this.fileObj[0].length; i++) {
      this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]));
    }
    this.setState({ images: this.fileArray });
  }

  //Handle fields change
  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };

  closeModal() {
    this.setState({
      visible: false
    });
  }

  handleCreateProject() {
    const project = {
      name: this.state.projectName,
      description: this.state.description,
      images: this.state.images,
      link: this.state.link
    };
    this.props.createProject(project);
    this.closeModal();
  }

  render() {
    let row = [];
    let rowIndex = -1;
    for (let i = 0; i < this.state.file.length; i = i + 5) {
      rowIndex++;
      row[rowIndex] = (
        <div className="row imageRow">
          <div className="col imagecol">
            <Img className="pictures" src={this.fileArray[i]}></Img>
          </div>
          <div className="col imagecol">
            <Img className="pictures" src={this.fileArray[i + 1]}></Img>
          </div>
          <div className="col imagecol">
            <Img className="pictures" src={this.fileArray[i + 2]}></Img>
          </div>
          <div className="col imagecol">
            <Img className="pictures" src={this.fileArray[i + 3]}></Img>
          </div>
          <div className="col imagecol">
            <Img className="pictures" src={this.fileArray[i + 4]}></Img>
          </div>
        </div>
      );
    }

    let link = null;
    var isUrl = require("is-url");
    if (isUrl(this.state.projectLink)) {
      link = <div>{this.state.projectLink}</div>;
    } else {
      link = (
        <input
          type="text"
          placeholder="add link to your project"
          value={this.state.projectLink}
          onChange={this.handleChange("projectLink")}
        ></input>
      );
    }

    return (
      <section>
        <Modal
          visible={this.state.visible}
          width="600"
          height="600"
          effect="fadeInUp"
          onClickAway={() => this.closeModal()}
        >
          <div className="popup">
            <h1>Add Project</h1>
            <div className="row">
              <div className="col">
                <p> project Link</p>
                <Linkify>{link}</Linkify>
              </div>
              <div className="col">
                <input
                  type="text"
                  placeholder="* Project Name"
                  value={this.state.projectName}
                  required
                  onChange={this.handleChange("projectName")}
                />
                <br></br>
                <hr></hr>
                <textarea
                  className="description"
                  value={this.state.description}
                  required
                  onChange={this.handleChange("description")}
                  placeholder="* Project Description"
                />
              </div>
              <div className="col">
               <ProjectPhotos  photosStore={photosStore}></ProjectPhotos>
              </div>
            </div>
            <div>
             
             
            </div>
            <button
              className="btn btn-primary float-right"
              onClick={this.handleCreateProject}
            >
              Create
            </button>
            <a href="javascript:void(0);" onClick={() => this.closeModal()}>
              Close
            </a>
          </div>
        </Modal>
      </section>
    );
  }
}
