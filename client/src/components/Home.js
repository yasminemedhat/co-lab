import React from "react";
import "../css/home.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "../fonts/Linearicons-Free-v1.0.0/icon-font.min.css";
import { getHomePage, getCollaboration, getProject } from "../utils/APICalls";
import { getJwt } from "../helpers/jwt";
import { Row, Col } from "react-bootstrap";
import HomeProjectLink from "./HomeProjectLink";
import { withRouter } from "react-router-dom";
import { AuthContext } from "../authContext";


class Home extends React.Component {
  
  
  static contextType = AuthContext;

  constructor(props){

    super(props);
    this.state = {
      loadingProjects: true,
      projects: [{}],
    };
    this.showProjectDetails = this.showProjectDetails.bind(this);
}


showProjectDetails = project => {
  let path = '';
  if(project.projectType && project.projectType === "Colaboration"){
      path = "/collaborations/"+project._id;
      getCollaboration(this.context.accessToken,project._id).then(data => {
        this.props.history.push({
          pathname: path,
          state: {
            collaboration: data
          }
        });
      })
  }else{
    path = "/projects/"+project._id;
    getProject(this.context.accessToken,project._id).then(data => {
      this.props.history.push({
        pathname: path,
        state: {
          project: data
        }
      });
    })
  }
  
}


  componentDidMount() {
    const jwt = getJwt();
    getHomePage(jwt).then(res => {
      if(res.status === 204){

        this.setState({projects: [], loadingProjects: false});
      }
      else{
        this.setState({projects: res.data, loadingProjects: false});
      }
      
    })
    // .catch(err => {
    //     alert("Could not get any posts: ", err.message);
    // })

  }



  render() {
    const { loadingProjects, projects } = this.state;
    if (loadingProjects === true || !projects) {
      return (
        <div>
          <h1>loading...</h1>
        </div>
      );
    }
    else if(projects.length > 0){
      return(
        <Row
        style={{
          width: "100%",
          height: "430px",
          marginLeft: "20px"
        }}>
          {this.state.projects.map((project, i) => {
        // Return the element. Also pass key
        return (
         
          <Col key={i}
                style={{
                  width: "100%",
                  height: "430px"
                }}>
            <HomeProjectLink
              key={i}
              project={project}
              showProjectDetails={this.showProjectDetails}
            /></Col>
        );
      })}
      </Row>)
    }else{
      return(<div><h2>Not following anyone yet? Go to the disvover page and start Co-Labing NOW ;)</h2></div>)
    }
    
    }
      
  
}

export default withRouter(Home);
