import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "../css/header.css";
import { withRouter } from "react-router-dom";
import { AuthContext } from "../authContext";

class Navbar extends Component {
  static contextType = AuthContext;

  constuctor(props) {
    this.super(props);
    this.logout = this.logout.bind(this);
  }
  logout() {
    this.context.logout();
  }
  render() {
    return (
      <div className="topnav">
        <div className="logo_div">
          <h2 className="logo">Co-Lab</h2>
        </div>
        <div className="navigation">
        
            <NavLink
              activeStyle={{
                fontWeight: "bold",
                color: "red"
              }}
              activeClassName="selectedLink"
              to="/"
            >
              Home
            </NavLink>
            <NavLink activeClassName="selectedLink" to="/about">
              About
            </NavLink>
            <NavLink activeClassName="selectedLink" to="/editUser">
              Edit Profile
            </NavLink>
            <button className="logout-NavLink" onClick={this.props.logout}>
              Logout
            </button>
       
        </div>
        <div>{this.props.children}</div>
      </div>
    );
  }
}

export default withRouter(Navbar);
