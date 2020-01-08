import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "../css/header.css";
import { withRouter } from "react-router-dom";
import { AuthContext } from "../authContext";
import Img from "react-image";
import Image from 'react-bootstrap/Image'
import { Row, Col } from "react-bootstrap";

class Navbar extends Component {
  static contextType = AuthContext;
  state = {avater : ''}
  constuctor(props) {
    this.super(props);
    this.logout = this.logout.bind(this);
    this.goToProfile = this.goToProfile.bind(this);
  }
  logout() {
    console.log("hey;")
    this.context.logout();
  }
  goToProfile(){
    let path = "/users/"+this.context.user.id;
    this.props.history.push({
      pathname : path
      });
  }
  componentDidMount(){
    if(this.context.authenticated===true &&this.context.user.avatar){
      this.setState({avatar : this.context.user.avatar});
    }
    
  }
  render() {
    if(this.context.authenticated){
      return (
        <div className="topnav">
          <div className="logo_avatar_div">
          <Row><Col tag='a'
            onClick={() => {this.goToProfile()}}>
          {this.state.avatar ? (
                <Image className="navbarAvatar" src={this.state.avatar} style={{width: 45, height: 45}} roundedCircle ></Image>
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
                to="/"
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
