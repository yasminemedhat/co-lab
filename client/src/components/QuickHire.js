import React from 'react';
import '../css/about.css';
import '../bootstrap/css/bootstrap.min.css';
import '../fonts/font-awesome-4.7.0/css/font-awesome.min.css';
import '../fonts/Linearicons-Free-v1.0.0/icon-font.min.css';
import { getJwt } from "../helpers/jwt";
import {
    
    acceptHire
  } from "../utils/APICalls";
class QuickHire extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      firstName: '',
      lastName: '',
      money: '',
      date: '',
      _id: '',
      job_id:'',
      employer_id:''
    };
   
  }
  accept(job){
    const jwt = getJwt();
    acceptHire(jwt, job);
    window.location.reload(false);
   
  }
  componentDidMount() {
    const { title, description, money, date, employer } = this.props.job;
    const job_id = this.props.job._id
    console.log("id")
    console.log(job_id)
    const { firstName, lastName } = this.props.employer;
    const employer_id = this.props.employer._id

    this.setState({
      title,
      description,
      money,
      date,
      firstName,
      lastName,
      job_id,
      employer_id
    });
  }
  render() {
    let date = new Date(this.state.date);
    console.log(this.props.job);
    if (this.state.title === undefined) {
      return (
        <div>
        
        </div>
      );
    }
    return (
      <div>
        <h6>{this.state.title}</h6>
        <p style={{ color: 'black',fontSize: "15px" }}>
          Employer:{' '}
          <a style={{ color: 'black',fontSize: "15px" }} href={'/users/' + this.state._id}>
            {this.state.firstName} {this.state.lastName}
          </a>
        </p>

        <p style={{ color: 'black',fontSize: "15px" }}>Job Description: {this.state.description}</p>
        <p style={{ color: 'black',fontSize: "15px" }}> Date: {date.toDateString()}</p>
        <p style={{ color: 'black',fontSize: "15px" }}>Payment: {this.state.money}</p>
        <button
         
          className='profile-btn'
          style={{width:'60px'}}
          onClick={() => this.accept(this.state.job_id)}
        >
          Accept
        </button>
      </div>
    );
  }
}

export default QuickHire;
