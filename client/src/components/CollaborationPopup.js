import React, { Component } from "react";
import Modal from "react-awesome-modal";
import "../css/projectPopup.css";
import "../css/profile.css";
import Linkify from "react-linkify";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import { getInterestsList} from '../utils/APICalls';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';


class CollaborationPopup extends Component {
  state = {
    collaborationName: "",
    description: "",
    collaborationLink: "",
    images: [],
    chosenfields: [],
    fieldsList: []
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: true};
    // this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCreateCollaboration = this.handleCreateCollaboration.bind(this);
    this.onChangeImages = this.onChangeImages.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChosenfields = this.handleChosenfields.bind(this)
  }


  //Handle fields change
  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };
  handleChosenfields =selectedOption=>{
       
          
    this.setState({
   chosenfields:selectedOption
    
    
});
  }

  componentDidMount(){
    getInterestsList().then(data => {
      let  interestsList = data.map(Interests => { return {value: Interests, display: Interests, label: Interests} })
        this.setState({ fieldsList:(interestsList) });
      }).catch(err => {
          if(err && err.data){
            alert("Could not find project fields: ",err.data.message);
          }
    })

  }

  closeModal() {
    this.setState({
      visible: false
    });
  }

  onChangeImages = e => {
    this.setState({ images: e.target.files })
  };

  handleCreateCollaboration() {
    
    const { images } = this.state;

    const formData = new FormData();
    formData.append('name', this.state.projectName);
    formData.append('description', this.state.description);
    formData.append('fields', this.state.chosenfields);
    if(this.state.collaborationLink.length > 0){
        formData.append('link', this.state.collaborationLink);
    }
    for (let i = 0 ; i < images.length ; i++) {
      formData.append("photos", images[i]);
   }

    this.props.createCollaboration(formData);
    this.closeModal();
  }

  render() {


    let link = null;
    var isUrl = require("is-url");
    if (isUrl(this.state.collaborationLink)) {
      link = <div>{this.state.collaborationLink}</div>;
    } else {
      link = (
          <div>
        <input
          type="text"
          placeholder="Add a link to the Co-laboration"
          value={this.state.projectLink}
          onChange={this.handleChange("collaborationLink")}
        ></input></div>
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
            <h1>Add Co-Laboration</h1>
            <div className="row">
              <div className="col">
                <p> Co-Laboration Link</p>
                <Linkify>{link}</Linkify>
              </div>
              <div className="col">
                <input
                  type="text"
                  placeholder="* Co-laboration Name"
                  value={this.state.collaborationName}
                  required
                  onChange={this.handleChange("collaborationName")}
                />
                <br></br>
                <hr></hr>
                <textarea
                  className="description"
                  value={this.state.description}
                  required
                  onChange={this.handleChange("description")}
                  placeholder="* Co-Laboration Description"
                />
              </div>
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
            <div className="row" style = {{    width: "100%" ,padding: "5%"}}>
              <ReactMultiSelectCheckboxes options={this.state.fieldsList}   onChange={this.handleChosenfields} placeholderButtonLabel='Choose Project Field(s)' />
              </div>
            <button
              className="btn btn-primary float-right"
              onClick={this.handleCreateCollaboration}
            >
              Create
            </button>
            
          </div>
        </Modal>
      </section>
    );
  }
}
export default CollaborationPopup;