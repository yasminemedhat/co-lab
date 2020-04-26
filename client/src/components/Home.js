import React from "react";
import "../css/home.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "../fonts/Linearicons-Free-v1.0.0/icon-font.min.css";
import Gallery from "react-grid-gallery";
import { getHomePage, getCollaboration, getProject } from "../utils/APICalls";
import { getJwt } from "../helpers/jwt";
import { withRouter } from "react-router-dom";
import { AuthContext } from "../authContext";
import Toast from 'light-toast';


class Home extends React.Component {
  
  
  static contextType = AuthContext;

  constructor(props){

    super(props);
    this.state = {
      loadingProjects: true,
      projects: [{}],
      currentImage: 0
    };
    this.showProjectDetails = this.showProjectDetails.bind(this);
    this.onCurrentImageChange = this.onCurrentImageChange.bind(this);
}

onCurrentImageChange(index) {
  this.setState({ currentImage: index });
}

showProjectDetails (){
  let index = this.state.currentImage 
  let project = this.state.projects[index]
  let path = '';
  const jwt = getJwt();
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
              { Toast.loading("Please wait")
             }
        </div>
       
      );
    
    }
   
    
    else if(projects.length > 0){
      setTimeout(() => {
        Toast.hide();
      }, 200);
      let len = 0;
      let IMAGES = [{}]


      this.state.projects.map((project) => {
        // Return the element. Also pass key
        let image = project.images[0] ? project.images[0] : []  
        IMAGES.push({src:image, thumbnail:image,
          tags: [{value: project.name, title: project.name}],
          caption: project.description,
          thumbnailWidth: 250,
          thumbnailHeight: 150,})
          
          })

      IMAGES = IMAGES.slice(1,IMAGES.length)
            
      
      return(
        <div className="gallery_container">
         <div className="gallery_div">
          <Gallery images={IMAGES} enableLightbox={true}
                    enableImageSelection={false}
                    currentImageWillChange={this.onCurrentImageChange}
                    customControls={[
                      <button className="goto" key="seeProject" onClick={this.showProjectDetails}>see Project</button>
                  ]} />
        </div>
        </div>
        )
       
    }else{
      return(<div><h2>Not following anyone yet? Go to the disvover page and start Co-Labing NOW ;)</h2></div>)
    }
    
    }
      
  
}

export default withRouter(Home);
