import React, { Component } from "react";
import { NavLink }  from "react-router-dom";
import "../css/header.css"
class HomeNavbar extends Component {
    
    render() { 
        return (  
            <div className="topnav">
        <div className="logo_div">
          <h2 className="logo">Co-Lab</h2>
        </div>
        <div className="navigation">
       
               <ul>
                 <NavLink exact activeClassName="selectedLink" to='/'>Home</NavLink>
                 <NavLink exact  activeClassName="selectedLink" to='/about' >About</NavLink>
                 <NavLink exact activeClassName="selectedLink" to='/login' >Login</NavLink>
               </ul>
   
        
        </div>
      </div>
        );
    }
}
 
export default HomeNavbar;