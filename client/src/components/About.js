import React from "react";
import "../css/login.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "../fonts/Linearicons-Free-v1.0.0/icon-font.min.css";

class About extends React.Component {
  render() {
    return (
      <div>
        <div className="Limiter">
          <div className="main_container">
            <h4    style={{ paddingLeft:"10%" ,  paddingRight:"10%"}}>
              Co-Lab is a platform through which talented creators can share their work,
              grow in their fields, collaborate in projects and be discovered
              and employed. On the other hand, it enables clients to discover
              talented creators and explore their work through us. Since every
              client is unique, the application will provide search results
              based on their search history
            </h4>
          </div>
        </div>
      </div>
    );
  }
}

export default About;
