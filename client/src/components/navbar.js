import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "../css/header.css";
import { withRouter } from "react-router-dom";
import { AuthContext } from "../authContext";
import Image from 'react-bootstrap/Image'
import { Row, Col } from "react-bootstrap";

class Navbar extends Component {
  static contextType = AuthContext;

  constuctor(props) {
    this.super(props);
    this.logout = this.logout.bind(this);
    this.goToProfile = this.goToProfile.bind(this);
  }
  logout() {
    this.context.logout();
  }
  goToProfile(){
    let path = "/users/"+this.context.user._id;
    this.props.history.push({
      pathname : path
      });
      window.location.reload();
  }
 
  
  render() {
    let image
    let source = this.context.user && this.context.user.avatar ? this.context.user.avatar :"../images/profile.png";
    if(source == null ) {
      image =  <Image className="navbarAvatar" src={require("../images/profile.png")} style={{width: 45, height: 45}} roundedCircle></Image>
    } 
    else {
      
     image = <Image className="navbarAvatar" src={this.context.user && this.context.user.avatar ? this.context.user.avatar : require("../images/profile.png")} style={{width: 45, height: 45, margin:"5px"}} roundedCircle ></Image>
    }
    if(this.context.authenticated){
      return (
        <div className="topnav">
          <div className="logo_avatar_div">
          <Row><Col tag='a'
            onClick={() => {this.goToProfile()}}>
             {this.context.user.avatar ? (
                <Image className="navbarAvatar" src={this.context.user.avatar} style={{width: 45, height: 45, margin:"5px"}} roundedCircle ></Image>
              ) : (
                <Image className="navbarAvatar" src={require("../images/profile.png")} style={{width: 45, height: 45}} roundedCircle></Image>
              )}
              

              </Col>
            </Row></div>
          <div className="logo_div">
            <h2 className="logo">Co-Lab</h2>
          </div>
          <div className="navigation">
          
              <NavLink
                exact
                activeClassName="selectedLink"
                to="/home"
              >
                Home
              </NavLink>
              <NavLink exact activeClassName="selectedLink" to="/about" >
                About
              </NavLink>
              <NavLink exact activeClassName="selectedLink" to="/editUser">
                Edit Profile
              </NavLink>
              <button className="logout-NavLink" onClick={()=>this.logout()}>
                Logout
              </button>
         
          </div>
          <div>{this.props.children}</div>
        </div>
      );
    }
    else{
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
}

export default withRouter(Navbar);
