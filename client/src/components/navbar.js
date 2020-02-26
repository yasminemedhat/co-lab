import React, { Component } from "react";
import { NavLink, Switch } from "react-router-dom";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "../fonts/Linearicons-Free-v1.0.0/icon-font.min.css";
import "../css/header.css";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { getNotifications, openNotification } from "../utils/APICalls";
import { withRouter } from "react-router-dom";
import { AuthContext } from "../authContext";
import Image from "react-bootstrap/Image";
import { Row, Col } from "react-bootstrap";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

class Navbar extends Component {
  static contextType = AuthContext;
  state = {
    notifications: []
  };
  constuctor(props) {
    this.super(props);
    this.state = {
      notifications: []
    };
    this.logout = this.logout.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.goToProfile = this.goToProfile.bind(this);
  }
  logout() {
    this.context.logout();
  }
  componentDidMount() {
    getNotifications(this.context.accessToken).then(data => {
      console.log("hii");

      this.setState({
        notifications: data
      });
    });
    console.log(" thissssss notifications");
    console.log(this.state.notifications);
  }

  goToProfile() {
    let path = "/users/" + this.context.user._id;
    this.props.history.push({
      pathname: path
    });
    window.location.reload();
  }

  unseenNotificationCount() {
    let count = 0;
    this.state.notifications.forEach(element => {
      if(element.isOpened == false)
        count++;
    }); 
    return count;
  }

  getNotificationPath(notification) {
    console.log(notification);
    const ObjectsToBeOpened = Object.freeze({
      SENDER: "sender",
      PROJECT: "project",
      COLLABORATION: "co-laboration"
    });
     let path;
    switch (notification.objectToBeOpened) {
      case ObjectsToBeOpened.SENDER:
        path =  "/users/"+notification.sender;
        break;
      case ObjectsToBeOpened.PROJECT:
        path =  "/projects/"+notification.project;
        break;
      case ObjectsToBeOpened.COLLABORATION:
       path =  "/collaborations/"+notification.project;
        break;
    }
     return path;
  }

  openNotification (notification)
  {
    openNotification(this.context.accessToken, notification._id);
  }

  render() {
    console.log("my notifications");
    console.log(this.state.notifications);
    let image;
    let source =
      this.context.user && this.context.user.avatar
        ? this.context.user.avatar
        : "../images/profile.png";
    if (source == null) {
      image = (
        <Image
          className="navbarAvatar"
          src={require("../images/profile.png")}
          style={{ width: 45, height: 45 }}
          roundedCircle
        ></Image>
      );
    } else {
      image = (
        <Image
          className="navbarAvatar"
          src={
            this.context.user && this.context.user.avatar
              ? this.context.user.avatar
              : require("../images/profile.png")
          }
          style={{ width: 45, height: 45, margin: "5px" }}
          roundedCircle
        ></Image>
      );
    }
    if (this.context.authenticated) {
      return (
        <div className="topnav ">
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
          ></link>
          <div className="logo_avatar_div">
            <Row>
              <Col
                tag="a"
                onClick={() => {
                  this.goToProfile();
                }}
              >
                {this.context.user.avatar ? (
                  <Image
                    className="navbarAvatar"
                    src={this.context.user.avatar}
                    style={{ width: 45, height: 45, margin: "5px" }}
                    roundedCircle
                  ></Image>
                ) : (
                  <Image
                    className="navbarAvatar"
                    src={require("../images/profile.png")}
                    style={{ width: 45, height: 45 }}
                    roundedCircle
                  ></Image>
                )}
              </Col>
            </Row>
          </div>
          <div className="logo_div">
            <h2 className="logo">Co-Lab</h2>
          </div>
          <div class="search-container">
            <form action="/action_page.php">
              <input type="text" placeholder="Search.." name="search" />
              <button type="submit">
                <i class="fa fa-search"></i>
              </button>
            </form>
          </div>
          <div className="navigation ">
            <NavLink exact activeClassName="selectedLink" to="/home">
              Home
            </NavLink>

            <NavLink exact activeClassName="selectedLink" to="/about">
              About
            </NavLink>
            <NavLink exact activeClassName="selectedLink" to="/editUser">
              Edit Profile
            </NavLink>

            <div className="dropdown">
              <button className="notification ">
                <span>
                  <i className="material-icons">notifications_active</i>
                </span>
                <span className="badge">{this.unseenNotificationCount()}</span>
              </button>
              <div className="dropdown-content">
                {this.state.notifications.map(notification => (
                  <div style={{ background: (notification.isOpened ? 'white' : '#ddd') }}>
                    
                  <a href={this.getNotificationPath(notification)} 
                      onClick={() => this.openNotification(notification)}>
                    <label className="notification-title">{notification.title}</label>
                    <br/>
                    {notification.body}
                  </a>
                  <hr></hr>
                  </div>
                ))}
              </div>
            </div>
            <button className="logout-NavLink" onClick={() => this.logout()}>
              Logout
            </button>
          </div>

          <div>{this.props.children}</div>
        </div>
      );
    } else {
      return (
        <div className="topnav">
          <div className="logo_div">
            <h2 className="logo">Co-Lab</h2>
          </div>
          <div className="navigation">
            <ul>
              <NavLink exact activeClassName="selectedLink" to="/">
                Home
              </NavLink>
              <NavLink exact activeClassName="selectedLink" to="/about">
                About
              </NavLink>
              <NavLink exact activeClassName="selectedLink" to="/login">
                Login
              </NavLink>
            </ul>
          </div>
        </div>
      );
    }
  }
}

export default withRouter(Navbar);
