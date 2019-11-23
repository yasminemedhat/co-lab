import React, { Component } from "react";
import { Link }  from "react-router-dom";

class HomeNavbar extends Component {
    
    render() { 
        return (  
            <div className="topnav">
        <div className="logo_div">
          <h2 className="logo">Co-Lab</h2>
        </div>
        <div className="navigation">
       
               <ul>
                 <Link to='/'>Home</Link>
                 <Link to='/about'>About</Link>
                 <Link to='/login'>Login</Link>
               </ul>
   
        
        </div>
      </div>
        );
    }
}
 
export default HomeNavbar;