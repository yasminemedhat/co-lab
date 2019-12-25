import React, { Component } from "react";
import "../css/ProjectPage.css";
import "../css/createProject.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import Img from "react-image";



class ProjectPage extends Component {
  state = {
    project: undefined,

  };
  componentDidMount() {
    
    this.setState({
      project: this.props.location.state.project
    });
    
}
 
  render() {

        
    if (this.state.project === undefined) {
      return (
        <div>
          <h1>loading...</h1>
        </div>
      );
    }


    let images = this.state.project.images ? this.state.project.images : require('../images/img-01.png')
    let row= [];
    let rowIndex = -1
    for (let i=0;i<images.length;i= i+3){
        rowIndex++
        row[rowIndex] = <div className="row imageRow">
            <div className = "col imagecol">
            <Img className="project_pictures" style={{ float: 'right'}} src={images[i]}></Img>
            </div>
            <div className = "col imagecol">
            <Img className="project_pictures" src={images[i+1]}></Img>
            </div>
            <div className = "col imagecol">
            <Img className="project_pictures" style={{ float: 'left'}} src={images[i+2]}></Img>
            </div>  
            </div>

    }


  


    return (
      <div className="ProjectContainer">
        <div className="row">
          <div className="col"></div>
          <div className="col">
          <h1>{this.state.project.name}</h1>
          <p>{this.state.project.description}</p>
          <p>{this.state.project.link}</p>
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
