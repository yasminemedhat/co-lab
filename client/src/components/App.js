import React from "react";
import "../css/header.css";
import {BrowserRouter as Router, Switch } from 'react-router-dom'
import {Route} from 'react-router-dom'
import Login from './Login';
import Home from "./Home";
import About from "./About";
import RegistrationForm from "./RegistrationForm";
import HomeNavbar from "./home-navbar";
import Profile from "./Profile";
import AuthenticatedComponent from "./AuthenticatedComponent";

class Header extends React.Component {
  render() {
    return (
      <Router>
        <HomeNavbar />
        <Switch>
          <Route path="/Auth" exact strict component = {AuthenticatedComponent}></Route>
          <Route path="/" exact strict  component ={Home} ></Route>
          <Route path="/about" exact strict component = {About}></Route>
          <Route path="/login" exact strict  component = {Login}></Route>
          <Route path="/RegistrationForm" exact strict component ={RegistrationForm} />
          <AuthenticatedComponent>
            <Route path="/profile" exact strict component ={Profile} />
          </AuthenticatedComponent>
          

        </Switch>

       </Router>
    );
  }
}

export default Header;