import React, { useState, useEffect, Component } from "react";
import { updateProject } from "../utils/APICalls";
import { getJwt } from "../helpers/jwt";
import "../css/login.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import Img from "react-image";
import { getInterestsList } from "../utils/APICalls";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import { AuthContext } from "../authContext";
import { getCollaboration } from "../utils/APICalls";
import Toast from 'light-toast';

class EditCollaboration extends Component {
  static contextType = AuthContext;

  state = {
    collaboration: undefined,
    images: []
  };
  constructor(props) {
    super(props);
    this.state = { collaboration: {} };
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  onChangeImages = e => {
    this.setState({ 
     images:  e.target.files
    
    })
    console.log("concatenated images")
    console.log(this.state.images)

  };


  updateCollaboration = e => {
    e.preventDefault();
    let path = "/collaborations/"+this.state.collaboration._id
    const jwt = getJwt();
    const formData = new FormData();

    if (this.state.images) {
     console.log("in images")
     console.log(this.state.images)
      
      for (let i = 0 ; i < this.state.images.length ; i++) {
          formData.append("photos", this.state.images[i]);
       }
     
    }
  
    if (this.state.name) {
      formData.append("name", this.state.name);
    }
 
    if (this.state.description) {
    
      formData.append("description", this.state.description);
    }
    if (this.state.link) {
      formData.append("link", this.state.link);
    }
  
    updateProject(jwt, formData,this.state.collaboration._id)
      .then(data => {
        Toast.success('Your Project was updated', 2000, () => {
          // do something after the toast disappears
          this.props.history.push(path);
        });
      })
      .catch(error => {
        console.log("not updatedddd");
        Toast.fail("Could not update project", 2000);
      });
  };

  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };



  componentDidMount() {
    const jwt = getJwt();
    getCollaboration(jwt, this.props.match.params.id)
      .then(collaboration => {
        let images = collaboration.images ? collaboration.images : [];
        this.setState({ collaboration: collaboration, images: images });
        console.log("print colab!!!!!!!");
        console.log(this.state.collaboration);
      })
      .catch(err => {
       // alert("could not find colab");
       Toast.fail("Could not find colab", 2000);
      });
  }

  

  render() {
    const collaboration = this.state.collaboration;
  
    const { name, description,link , images} = this.state.collaboration;
      
    let editimages = []
    if(images !=undefined){
        editimages = images.map((image , i)=>{
            return(
                <Img key = {i} style={{ float: 'right' , width: '40px' , height: '40px'}} src={image}></Img>
            );
        })
    }

    if (collaboration.length === {}) {
      return (
        <div>
          <h1>loading...</h1>
        </div>
      );
    }

 

    return (
      <div>
        <div className="profile_container">
          <div
            className="wrap-edit100 p-l-50 p-r-50 p-t-77 p-b-30"
            style={{ marginLeft: "30%" }}
          >
            <form className="login100-form validate-form">
              <span className="login100-form-title p-b-55">
                Edit Collaboration
              </span>
              <div className="wrap-input100 validate-input m-b-16">
                <label>Collaboration name</label>
            <input
              className="input100"
              type="text"
              name="name"
              defaultValue={name}
              placeholder="collaboration Name"
              onChange={this.handleChange("name")}
            />
            <span className="focus-input100"></span>
         
          </div>
          <div className="wrap-input100 validate-input m-b-16">
                <label>Project description: </label>
            <input
              className="input100"
              type="text"
              name="description"
              defaultValue={description}
              placeholder="project description"
              onChange={this.handleChange("description")}
            />
            <span className="focus-input100"></span>
         
          </div>
          <div className="wrap-input100 validate-input m-b-16">
                <label>Collaboration link: </label>
            <input
              className="input100"
              type="text"
              name="link"
              defaultValue={link}
              placeholder="project link"
              onChange={this.handleChange("link")}
            />
            <span className="focus-input100"></span>
         
          </div>
          <div className="row">
              <label>Change images</label>
              <input
                onChange={this.onChangeImages}
                type="file"
                name="images"
                multiple
                accept="image/png, image/jpeg, image/jpg"
              />
              {editimages}
          </div>
          <div className="container-login100-form-btn p-t-25">
            <input
              type="submit"
              className="login100-form-btn"
              value="Save Changes"
              onClick={this.updateCollaboration}
            />
          </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default EditCollaboration;
