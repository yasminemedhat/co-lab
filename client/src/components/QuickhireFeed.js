import React from "react";
import "../css/about.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "../fonts/Linearicons-Free-v1.0.0/icon-font.min.css";
import { getJwt } from "../helpers/jwt";
import QuickHire from "./QuickHire";

import {
  quickhireFeed,
 
} from "../utils/APICalls";

class QuickhireFeed extends React.Component {
  constructor() {
    super();
    this.state = {
      feed:[{}]
    };
  
   
  }
  componentDidMount(){
    const jwt = getJwt();
    quickhireFeed(jwt).then(Feed =>{
      this.setState({
        feed:Feed.data
      })
    })
  }
 
  render() {

    return (
      <div>
 
        <div className="Limiter">
          <div className="main_container">
            {this.state.feed.map((job,i) => {
              let employer = {...job.employer}
      
              return(
                <div key={i} className="row" style = {{borderBottom: "2px solid #3d2846" ,padding:"0.5%" ,lineHeight: "0.6"}}>
                <QuickHire key={i} job ={job} employer = {employer} ></QuickHire>
                </div>
              )
             
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default QuickhireFeed;
