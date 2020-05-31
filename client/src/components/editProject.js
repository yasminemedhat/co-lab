import React, { Component } from "react";
import { updateProject, getProject } from "../utils/APICalls";
import { getJwt } from "../helpers/jwt";
import "../css/login.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import Img from "react-image";
import { getInterestsList } from "../utils/APICalls";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import { AuthContext } from "../authContext";
import Toast from 'light-toast';



class EditProject extends Component {
  static contextType = AuthContext;

  state = {
    project: undefined,
    images:[]

  };
  constructor(props) {
    super(props);
    this.state = { project: {} };
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };

  onChangeImages = e => {
    this.setState({ 
     images:  e.target.files
    
    })
    console.log("concatenated images")
    console.log(this.state.images)

  };

  updateProject = e => {
    e.preventDefault();
    let path = "/Projects/"+this.state.project._id
    const jwt = getJwt();
    const formData = new FormData();
    const { images } = this.state
    
    if (images) {
     
      
        for (let i = 0 ; i < images.length ; i++) {
            formData.append("photos", images[i]);
         }
       
      }
    if (this.state.name) {
      formData.append("name", this.state.name);
      console.log(this.state.name)
    }
 
    if (this.state.description) {
    
      formData.append("description", this.state.description);
      console.log(this.state.description)
    }
    if (this.state.link) {
      formData.append("link", this.state.link);
      console.log(this.state.link)
    }
  
    updateProject(jwt, formData,this.state.project._id)
      .then(data => {
        //alert("Your project was updated succeffully");
        Toast.success('Your Project was updated', 2000, () => {
          // do something after the toast disappears
          this.props.history.push(path);
        });
       
      })
      .catch(error => {
        console.log("not updatedddd");
       // alert("something went wrong!", error.message);
       Toast.fail("Could not update project", 2000);
      });
  };





  componentDidMount() {
    const jwt = getJwt();
    getProject(jwt, this.props.match.params.id)
      .then(project => {
       
        this.setState({ project: project.project,
                        images:project.project.images
        });
 

      
      })
      .catch(err => {
        alert("could not find project");
      });
  }

  render() {
    const project = this.state.project;


    if (project.length === {}) {
      return (
        <div>
          <h1>loading...</h1>
        </div>
      );
    }

    const { name, description, link,images } = this.state.project;

    
    let editimages = []
    if(images !=undefined){
        editimages = images.map((image , i)=>{
            return(
                <Img key = {i} style={{ float: 'right' , width: '40px' , height: '40px'}} src={image}></Img>
            );
        })
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
                Edit project
              </span>
              <div className="wrap-input100 validate-input m-b-16">
                <label>Project name: </label>
            <input
              className="input100"
              type="text"
              name="name"
              defaultValue={name}
              placeholder="project Name"
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
                <label>Project link: </label>
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
              onClick={this.updateProject}
            />
          </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default EditProject;
