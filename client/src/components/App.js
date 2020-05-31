import React from "react";
import "../css/header.css";
import {BrowserRouter as Router, Switch } from 'react-router-dom'
import {Route} from 'react-router-dom'
import Login from './Login';
import Search from './SearchResults';
import editUser from './editUser';
import EditCollaboration from './EditCollaboration'
import EditProject from './editProject'
import ForgotPassword from './forgotPassword';
import Home from "./Home";
import Discover from "./Discover";
import About from "./About";
import RegistrationForm from "./RegistrationForm";
import Profile from "./Profile";
import QuickhireFeed from "./QuickhireFeed";
import Auth from "./Auth";
import ProjectPage from "./ProjectPage";
import ColabDetails from "./ColabDetails";
import AuthenticatedComponent from "./AuthenticatedComponent";
import NavBar from './navbar';


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
            <Route path="/SearchResults/:searchTerm" exact strict  component ={Search} ></Route>
            
          
            <AuthenticatedComponent>
              <Route path="/users/:id" exact strict component ={Profile} >
                
              </Route>
              <Route path="/" exact strict  component ={Home} ></Route>
              <Route path="/home" exact strict  component ={Home} ></Route>
              <Route path="/discover" exact strict  component ={Discover} ></Route>
              <Route path="/quickhire" exact strict  component ={QuickhireFeed} ></Route>
              <Route path="/editUser" exact strict component ={editUser} />
              <Route path="/collaborations/:id/edit" exact strict component ={EditCollaboration} />
              <Route path="/projects/:id/edit" exact strict component ={EditProject} />
              <Route path="/projects/:id" exact strict component ={ProjectPage} />
              <Route path="/collaborations/:id" exact strict component ={ColabDetails} />
              </AuthenticatedComponent>

          </Switch>
          
        </Router>
       </Auth>
    );
  }
}

export default Header;
