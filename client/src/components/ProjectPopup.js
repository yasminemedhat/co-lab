import React, { Component } from "react";
import Modal from "react-awesome-modal";
import Img from "react-image";
import "../css/projectPopup.css";
import "../css/profile.css";
import Linkify from "react-linkify";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";

export default class ProjectPopup extends Component {
  state = {
    projectName: "",
    description: "",
    creator: "",
    projectLink: ""
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
  }

  uploadMultipleFiles(e) {
    this.fileObj = [];
    this.fileArray = [];
    this.fileObj.push(e.target.files);
    for (let i = 0; i < this.fileObj[0].length; i++) {
      this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]));
    }
    this.setState({ file: this.fileArray });
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
    var isUrl = require("is-url")
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
          width="500"
          height="500"
          effect="fadeInUp"
         
          onClickAway={() => this.closeModal()}
        >
       
          <div className="popup">
            <h1>Add Project</h1>
            <div className="row">
            <div className="col">
            <h5> project Link</h5>
            <Linkify>
            {link}
            </Linkify>
          </div>
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
                  className="picture-btn"
                  onClick={() => this.fileInput.click()}
                >
                  Add Pictures
                </button>
            
              </div>
            </div>
            <div className="imageContainer">{row}</div>
            <a href="javascript:void(0);" onClick={() => this.closeModal()}>
              Close
            </a>
          </div>
        </Modal>
       
      </section>
     
    );
  }
}
