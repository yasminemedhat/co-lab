import React from "react";
import "../css/home.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "../fonts/Linearicons-Free-v1.0.0/icon-font.min.css";
import HomeNavbar from "./home-navbar";
import Gallery from "react-grid-gallery";
import {
  getProjects,
  getCollaborations
} from "../utils/APICalls";

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loadingProjects: true,
      loadingCollaborations: true
    };
    this.routeChange = this.routeChange.bind(this);
}



  routeChange = () => {
    console.log("go to project page")
  };

  componentDidMount() {


  }



  render() {
    const IMAGES = [
    
    ];

    return (
      <div>
        {/* <HomeNavbar /> */}
        <div className="Limiter">
          <div className="gallery_container">
            <Gallery images={IMAGES} backdropClosesModal ={true}  enableLightbox={true}
                    enableImageSelection={false}  customControls={[
                      <button className="goto" key="seeProject" onClick={this.routeChange}>Go to Project</button>
                  ]}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
