import React, { Component } from "react";
import Modal from "react-awesome-modal";
import "../css/projectPopup.css";
import "../css/profile.css";
import Linkify from "react-linkify";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import { getInterestsList} from '../utils/APICalls';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';


class ProjectPopup extends Component {
  state = {
    projectName: "",
    description: "",
    projectLink: "",
    images: [],
    interestsList: [],
    field: ''
  };
  // fileObj = [];
  // fileArray = [];
  constructor(props) {
    super(props);
    this.state = {
      visible: true};
    // this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this);
    this.handleChange = this.handleChange.bind(this);
   
    this.handleCreateProject = this.handleCreateProject.bind(this);
    this.onChangeImages = this.onChangeImages.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  // uploadMultipleFiles(e) {
  //   this.fileObj = [];
  //   this.fileArray = [];
  //   this.fileObj.push(e.target.files);
  //   for (let i = 0; i < this.fileObj[0].length; i++) {
  //     this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]));
  //   }
  //   this.setState({ images: this.fileArray });
  // }

  //Handle fields change
  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };

  closeModal() {
    this.setState({
      visible: false
    });
  }

  onChangeImages = e => {
    this.setState({ images: e.target.files })
  };

  componentDidMount(){
    getInterestsList().then(data => {
      let  interestsList = data.map(Interests => { return {value: Interests, display: Interests, label: Interests} })
            this.setState({ interestsList: [{value: '', display: '(Select the project field)'}].concat(interestsList) });
      }).catch(err => {
          if(err && err.data){
            alert("Could not find project fields: ",err.data.message);
          }
    })

  }
  handleCreateProject() {
    
    const { images } = this.state;

    const formData = new FormData();
    formData.append('name', this.state.projectName);
    formData.append('description', this.state.description);
    formData.append('projectlink', this.state.projectLink);
    formData.append('field', this.state.field);
   
    if(images){
      for (let i = 0 ; i < images.length ; i++) {
        formData.append("photos", images[i]);
     }
    }
    

    this.props.createProject(formData);
    this.closeModal();
  }

  render() {


    let link = null;
    var isUrl = require("is-url");
    if (isUrl(this.state.projectLink)) {
      link = <div>{this.state.projectLink}</div>;
    } else {
      link = (
        <div>
           <input
          type="text"
          placeholder="add link to your project"
          value={this.state.projectLink}
          onChange={this.handleChange("projectLink")}
        ></input>
        </div>
       
      );
    }

    return (
      <section>
        <Modal
          visible={this.state.visible}
          width="600"
          height="600"
          effect="fadeInUp"
          onClickAway={this.closeModal}
        >
          <button  onClick={this.closeModal}
                    className="btn float-right">
              Close
            </button>
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
              {/* <div className="row" style = {{    width: "100%" ,padding: "5%"}}>
              <ReactMultiSelectCheckboxes options={this.state.fieldsList}   onChange={this.handleChosenfields} placeholderButtonLabel='Choose Project Field(s)' />
              </div> */}
              {this.state.interestsList ? (<div className="row" style = {{    width: "100%" ,padding: "5%"}}>
              <select defaultValue={this.state.field} onChange={this.handleChange("field")} >
                {this.state.interestsList.map(interest => (
                  <option key={interest.value} value={interest.value}>
                    {interest.display}
                  </option>
                ))}
              </select>
            </div>):null}
              
              <div className="col">
              <input
                onChange={this.onChangeImages}
                type="file"
                name="images"
                multiple
                accept="image/png, image/jpeg, image/jpg"
              />
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
            
          </div>
        </Modal>
      </section>
    );
  }
}
export default ProjectPopup;