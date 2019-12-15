import React, { Component } from "react";
import { Link }  from "react-router-dom";
import "../css/header.css"
import { withRouter } from "react-router-dom";


class Navbar extends Component {
    constuctor(props) {
        this.super(props);
    }

    render() { 
        return (  
            <div className="topnav">
        <div className="logo_div">
          <h2 className="logo">Co-Lab</h2>
        </div>
        <div className="navigation">
       
               <ul>
                 <Link to='/'>Home</Link>
                 <Link to='/about' >About</Link>
                 <button className='logout-link'
                        onClick={this.props.logout}>Logout</button>
               </ul>
   
        
        </div>
      </div>
        );
    }
}
 
export default withRouter(Navbar);