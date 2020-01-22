import React, { useState, useEffect, Component } from "react";
import { updateCollaboration } from "../utils/APICalls";
import { getJwt } from "../helpers/jwt";
import "../css/login.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import Img from "react-image";
import { getInterestsList } from "../utils/APICalls";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import { AuthContext } from "../authContext";
import { getCollaboration } from "../utils/APICalls";

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


  updateCollaboration = e => {
    e.preventDefault();
    let path = "/collaborations/"+this.state.collaboration._id
    const jwt = getJwt();
    const formData = new FormData();
  
    if (this.state.name) {
      formData.append("name", this.state.name);
    }
 
    if (this.state.description) {
    
      formData.append("description", this.state.description);
    }
    if (this.state.members) {
      formData.append("members", this.state.members);
    }
  
    updateCollaboration(jwt, formData)
      .then(data => {
        alert("Your collaboration was updated succeffully");
        this.props.history.push(path);
      })
      .catch(error => {
        console.log("not updatedddd");
        alert("something went wrong!", error.message);
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
        alert("could not find colab");
      });
  }

  render() {
    const collaboration = this.state.collaboration;
    console.log("print");
    console.log(collaboration);

    if (collaboration.length === {}) {
      return (
        <div>
          <h1>loading...</h1>
        </div>
      );
    }

    const { name, description, members } = this.state.collaboration;

    return (
      <div>
        <div className="profile_container">
          <div
            className="wrap-login100 p-l-50 p-r-50 p-t-77 p-b-30"
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
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default EditCollaboration;
