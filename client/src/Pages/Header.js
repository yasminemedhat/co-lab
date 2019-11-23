import React from "react";
import "../css/header.css";
import {BrowserRouter as Router, Switch } from 'react-router-dom'
import {Route} from 'react-router-dom'
import Login from '../Pages/Login';
import Home from "../Pages/Home";
import About from "../Pages/About";
import RegistrationPart1 from "../components/RegistrationPart1";
import HomeNavbar from "../components/home-navbar";


class Header extends React.Component {
  render() {
    return (
      <Router>
        <HomeNavbar />
        <Switch>
          <Route path="/" exact strict  component ={Home} ></Route>
          <Route path="/about" exact strict component = {About}></Route>
          <Route path="/login" exact strict  component = {Login}></Route>
          <Route path="/RegistrationPart1" exact strict component ={RegistrationPart1} />

        </Switch>

       </Router>
    );
  }
}

export default Header;
