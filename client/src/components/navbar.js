import React, { Component } from "react";
import { Link }  from "react-router-dom";
import "../css/header.css"
import { withRouter } from "react-router-dom";
import {AuthContext} from '../authContext';


class Navbar extends Component {
  static contextType = AuthContext;

    constuctor(props) {
        this.super(props);
        this.logout = this.logout.bind(this);
    }
    logout(){
      this.context.logout();
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
                 <Link to='/editUser' >Edit Profile</Link>
                 <button className='logout-link'
                        onClick={this.props.logout}>Logout</button>
               </ul>
   
        
        </div>
        <div>
                    {this.props.children}
                   
                </div> 
      </div>
        );
    }
}
 
export default withRouter(Navbar);