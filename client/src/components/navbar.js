import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import '../bootstrap/css/bootstrap.min.css';
import '../fonts/font-awesome-4.7.0/css/font-awesome.min.css';
import '../fonts/Linearicons-Free-v1.0.0/icon-font.min.css';
import '../css/header.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import {
  getNotifications,
  openNotification,
  viewHire,
} from '../utils/APICalls';
import { withRouter } from 'react-router-dom';
import { AuthContext } from '../authContext';
import Image from 'react-bootstrap/Image';
import { Row, Col } from 'react-bootstrap';
import 'react-dropdown/style.css';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import socket from '../../src/utils/notifications';
import ConfirmAlert from './confirmAlert.js';

class Navbar extends Component {
  static contextType = AuthContext;

  state = {
    notifications: [],
    notificationCount: 0,
    searchTerm: ''
  };
  constuctor(props) {
    this.super(props);
    this.state = {
      notifications: [],
      notificationCount: 0,
      searchTerm: '',
      quickHire: [{}],
      user: ''
    };
    this.logout = this.logout.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.goToProfile = this.goToProfile.bind(this);
    this.unseenNotificationCount = this.unseenNotificationCount.bind(this);
    this.getNotificationPath = this.getNotificationPath.bind(this);
    this.onKeyPress = this._handleKeyDown.bind(this);
  }
  logout() {
    this.context.logout();
  }
  componentDidMount() {
    if (this.context.authenticated) {
      getNotifications(this.context.accessToken)
        .then(data => {
          this.setState({
            notifications: data
          });
          this.unseenNotificationCount();
        })
        .catch(err => {
          if (err && err.status) {
            alert('something went wrong: ' + err.message);
          }
        });

      socket.on('notification', () => {
        console.log(`+1`);

        // this.setState({
        //   notificationCount:this.notificationCount+1
        // })

        getNotifications(this.context.accessToken)
          .then(data => {
            this.setState({
              notifications: data
            });
            this.unseenNotificationCount();
          })
          .catch(err => {
            if (err && err.status) {
              alert('something went wrong: ' + err.message);
            }
          });

        //TODO: update state
        //note: putting this anywhere else creates multiple listeners instead of one
        //which ruins the count
      });
    }
  }

  goToProfile() {
    let path = '/users/' + this.context.user._id;
    this.props.history.push({
      pathname: path
    });
    window.location.reload();
  }

  unseenNotificationCount() {
    let count = 0;
    this.state.notifications.forEach(element => {
      if (element.isOpened === false) count++;
    });
    this.setState({
      notificationCount: count
    });

    return count;
  }

  getNotificationPath(notification) {
    const ObjectsToBeOpened = Object.freeze({
      SENDER: 'sender',
      PROJECT: 'project',
      COLLABORATION: 'co-laboration',
      QUICKHIRE: 'Quick-Hire'
    });
    let path;
    switch (notification.objectToBeOpened) {
      case ObjectsToBeOpened.SENDER:
        path = '/users/' + notification.sender;
        break;
      case ObjectsToBeOpened.PROJECT:
        path = '/projects/' + notification.project;
        break;
      case ObjectsToBeOpened.COLLABORATION:
        path = '/collaborations/' + notification.project;
        break;
      case ObjectsToBeOpened.QUICKHIRE:
        path = notification.project;
        break;
    }
    return path;
  }

  openNotification(notification) {
    openNotification(this.context.accessToken, notification._id).catch(err => {
      if (err && err.status) {
        alert('something went wrong: ' + err.message);
      }
    });
    if (notification.title === 'Quick-Hire') {
      viewHire(notification.quickHire).then(data => {
        const quickHire = data.data.quickHire;

        this.setState({
          quickHire
        });

        
        if (notification.action === 'accepted your ') {
          this.setState({
            user: this.state.quickHire.employee
          });
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <ConfirmAlert
                  quickHire={this.state.quickHire}
                  onClose={onClose}
                  user={this.state.user}
                  userType='Employee'
                ></ConfirmAlert>
              );
            }
          });
        } else {
          this.setState({
            user: this.state.quickHire.employer
          });
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <ConfirmAlert
                  quickHire={this.state.quickHire}
                  onClose={onClose}
                  user={this.state.user}
                  userType='Employer'
                ></ConfirmAlert>
              );
            }
          });
        }
      });
    }
  }

  generateNotificationDropDown() {
    try {
      let dropDown = this.state.notifications.map(notification => (
        <div
          key={notification._id}
          style={{ background: notification.isOpened ? 'white' : '#ddd' }}
        >
          <a
            href={this.getNotificationPath(notification)}
            onClick={() => this.openNotification(notification)}
          >
            <label className='notification-title'>{notification.title}</label>
            <br />
            {notification.body}
          </a>
          <hr></hr>
        </div>
      ));
      return dropDown;
    } catch (error) {
      console.log(error.message);
    }
  }

  handleChange = event => {
    this.setState({
      searchTerm: event.target.value
    });
  };

  _handleKeyDown = event => {
    if (event.key === 'Enter') {
      // event.preventDefault();
      const path = '/SearchResults/' + this.state.searchTerm;
      //console.log(this.state.searchTerm);
      this.props.history.push({
        pathname: path,
        state: {
          searchTerm: this.state.searchTerm
        }
      });
    }
  };

  render() {
    let image;
    let source =
      this.context.user && this.context.user.avatar
        ? this.context.user.avatar
        : '../images/profile.png';
    if (source === null) {
      image = (
        <Image
          className='navbarAvatar'
          src={require('../images/profile.png')}
          style={{ width: 45, height: 45 }}
          roundedCircle
        ></Image>
      );
    } else {
      image = (
        <Image
          className='navbarAvatar'
          src={
            this.context.user && this.context.user.avatar
              ? this.context.user.avatar
              : require('../images/profile.png')
          }
          style={{ width: 45, height: 45, margin: '5px' }}
          roundedCircle
        ></Image>
      );
    }
    if (this.context.authenticated) {
      socket.emit('identify', this.context.user._id);
      return (
        <div className='topnav '>
          <link
            href='https://fonts.googleapis.com/icon?family=Material+Icons'
            rel='stylesheet'
          ></link>
          <div className='logo_avatar_div'>
            <Row>
              <Col
                tag='a'
                onClick={() => {
                  this.goToProfile();
                }}
              >
                {this.context.user.avatar ? (
                  <Image
                    className='navbarAvatar'
                    src={this.context.user.avatar}
                    style={{ width: 45, height: 45, margin: '5px' }}
                    roundedCircle
                  ></Image>
                ) : (
                  <Image
                    className='navbarAvatar'
                    src={require('../images/profile.png')}
                    style={{ width: 45, height: 45 }}
                    roundedCircle
                  ></Image>
                )}
              </Col>
            </Row>
          </div>
          <div className='logo_div'>
            <h2 className='logo'>Co-Lab</h2>
          </div>
          <div className='search-container'>
            <form id='search-form'>
              <input
                type='search'
                placeholder='Search'
                value={this.state.searchTerm}
                onChange={this.handleChange}
                onKeyDown={this._handleKeyDown}
              />
            </form>
          </div>
          <div className='navigation '>
            <NavLink exact activeClassName='selectedLink' to='/home'>
              Home
            </NavLink>
            <NavLink exact activeClassName='selectedLink' to='/quickhire'>
             Quick-Hire Feed
            </NavLink>

            <NavLink exact activeClassName='selectedLink' to='/discover'>
              Discover
            </NavLink>
            <NavLink exact activeClassName='selectedLink' to='/editUser'>
              Edit Profile
            </NavLink>
          

            <div className='dropdown'>
              <button className='notification '>
                <span>
                  <i className='material-icons'>notifications_active</i>
                </span>
                <span className='badge'>{this.state.notificationCount}</span>
              </button>
              <div className='dropdown-content'>
                {this.generateNotificationDropDown()}
              </div>
            </div>
            <button className='logout-NavLink' onClick={() => this.logout()}>
              Logout
            </button>
          </div>

          <div>{this.props.children}</div>
        </div>
      );
    } else {
      return (
        <div className='topnav'>
          <div className='logo_div'>
            <h2 className='logo'>Co-Lab</h2>
          </div>
          <div className='navigation'>
            <ul>
              {/* <NavLink exact activeClassName="selectedLink" to="/">
                Home
              </NavLink> */}
              <NavLink exact activeClassName='selectedLink' to='/about'>
                About
              </NavLink>
              <NavLink exact activeClassName='selectedLink' to='/login'>
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
