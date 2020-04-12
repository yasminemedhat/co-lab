import React from 'react';
import '../css/about.css';
import '../bootstrap/css/bootstrap.min.css';
import '../fonts/font-awesome-4.7.0/css/font-awesome.min.css';
import '../fonts/Linearicons-Free-v1.0.0/icon-font.min.css';
import {acceptHire} from '../utils/APICalls';

class confirmAlert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        title:'' ,
        description:'',
        money:'',
        date: new Date(),
        firstName:'' ,
        lastName:'' ,
         _id:'' ,
        userType:''
    };
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  componentDidMount() {
    const {title , description,money,date,availability } = this.props.quickHire;
    const userType = this.props.userType;
    const {firstName , lastName , _id } = this.props.user;
    this.setState({title , description,money,date ,availability,firstName , lastName , _id ,userType });
  }
  close(){
     this.props.onClose();
  }

  accept(){
    acceptHire(this.context.accessToken, this.props.quickHire);
    this.props.onClose(); 
  }

  render() {
    let date = new Date(this.state.date);

    let p;
    if (!this.state.availability && this.state.userType === 'Employer') {
      p = (
        <p style={{ color: 'red' }}>
          Sorry Quick-Hire is not available anymore!!
        </p>
      );
    }
    let buttons;
    if (this.state.availability && this.state.userType === 'Employer'){
        buttons = (     <div className='row'>
        <button
          disabled={!this.state.availability}
          className='profile-btn'
          style={{ float: 'right', width: '100px' }}
          onClick={this.close}
        >
          Decline
        </button>
        <button
          disabled={!this.state.availability}
          className='profile-btn'
          style={{ float: 'left', width: '100px' }}
          onClick={this.accept}
        >
          Accept
        </button>
      </div>)
    }
    return (
      <div>
        <div style={{ width: '100%' }}>
          <h1>{this.state.title}</h1>
          <p>Job description : {this.state.description}</p>
          <p>Job date : {date.toDateString()}</p>
          <p>Job money : {this.state.money}</p>
          <p style={{ float: 'left' }}>{this.state.userType}:</p>
          <a
            style={{ paddingLeft: '1%' }}
            href={'/users/' + this.state._id}
          >
            {' '}
            {this.state.firstName} {this.state.lastName}
          </a>
          <div className='row'>{p}</div>
          <div className='row'>{buttons}</div>
   
     
        </div>
      </div>
    );
  }
}

export default confirmAlert;
