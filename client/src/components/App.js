import React from "react";
import "../css/header.css";
import {BrowserRouter as Router, Switch } from 'react-router-dom'
import {Route} from 'react-router-dom'
import Login from './Login';
import editUser from './editUser';
import ForgotPassword from './forgotPassword';
import Home from "./Home";
import About from "./About";
import RegistrationForm from "./RegistrationForm";
import Profile from "./Profile";
import Auth from "./Auth";
import ProjectPage from "./ProjectPage";
import ColabDetails from "./ColabDetails";
import AuthenticatedComponent from "./AuthenticatedComponent";
import NavBar from './navbar';
import { AuthContext } from "../authContext";


class Header extends React.Component {

  render() {
    return (
      <Auth>
        
        <Router>
        <NavBar></NavBar>
          <Switch>
            {/* <Route path="/" exact strict  component ={Login} ></Route> */}
            <Route path="/about" exact strict component = {About}></Route>
            <Route path="/login" exact strict  component = {Login}></Route>
            <Route path="/forgotPassword" exact strict  component = {ForgotPassword}></Route>
            <Route path="/RegistrationForm" exact strict component ={RegistrationForm} />
            
          
            <AuthenticatedComponent>
              <Route path="/users/:id" exact strict component ={Profile} >
                
              </Route>
              <Route path="/" exact strict  component ={Home} ></Route>
              <Route path="/editUser" exact strict component ={editUser} />
              <Route path="/project/:id" exact strict component ={ProjectPage} />
              <Route path="/collaboration/:id" exact strict component ={ColabDetails} />
              </AuthenticatedComponent>

          </Switch>
          
        </Router>
       </Auth>
    );
  }
}

export default Header;
