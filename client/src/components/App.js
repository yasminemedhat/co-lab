import React from "react";
import "../css/header.css";
import {BrowserRouter as Router, Switch } from 'react-router-dom'
import {Route} from 'react-router-dom'
import Login from './Login';
import ForgotPassword from './forgotPassword';
import Home from "./Home";
import About from "./About";
import RegistrationForm from "./RegistrationForm";
import Profile from "./Profile";
import AuthenticatedComponent from "./AuthenticatedComponent";
import CreateProject from "./CreateProject";

class Header extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact strict  component ={Home} ></Route>
          <Route path="/about" exact strict component = {About}></Route>
          <Route path="/login" exact strict  component = {Login}></Route>
          <Route path="/forgotPassword" exact strict  component = {ForgotPassword}></Route>
          <Route path="/RegistrationForm" exact strict component ={RegistrationForm} />
        
          <AuthenticatedComponent>
            <Route path="/profile" exact strict component ={Profile} />
            <Route path="/CreateProject" exact strict component ={CreateProject} />
          </AuthenticatedComponent>
          

        </Switch>

       </Router>
    );
  }
}

export default Header;
