import React, { Component } from "react";
import { getUser } from '../utils/APICalls';
import { getJwt } from "../helpers/jwt";
import "../css/login.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import Img from "react-image";
import { getInterestsList} from '../utils/APICalls';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';

class editUserForm extends Component {
 
 state={
  interests:[],
  interestsList:[],
 }
  
 constructor(props){
   super(props);
   this.setState({isSponsor: this.props.user.isSponsor})
   this.handleChange = this.handleChange.bind(this);
  this.handleIsSponsor = this.handleIsSponsor.bind(this);
  this.onChangeProfilePicture = this.onChangeProfilePicture.bind(this);
  this.updateUser = this.updateUser.bind(this);
 }
 handleChange = input => e => {
  this.setState({ [input] : e.target.value});
}

//handle isSponsor field change
handleIsSponsor = () => {
  this.setState({ isSponsor : !this.state.isSponsor});
}
onChangeProfilePicture = e => {
  this.setState({ profilePicture: e.target.files[0] })
  console.log("dakhaly on change pp", this.state.profilePicture, e.target.files[0])
};
updateUser = () =>{
    const formData = new FormData();
    if(this.state.profilePicture){
        console.log("enta ta3ban?")
        formData.append('avatar', this.state.profilePicture);
        console.log("fi pp");
    }
    if(this.state.isSponsor){
        formData.append('isSponsor', this.state.isSponsor)
    }
    if(this.state.firstname){
        formData.append('firstname', this.state.firstname)
    }
    if(this.state.lastname){
        formData.append('lastname', this.state.lastname)
    }
    if(this.state.phone){
        console.log("phoneee ;)")
        formData.append('phone', this.state.phone)
    }
    if(this.state.biography){
        formData.append('biography', this.state.biography)
    }
    this.props.updateUser(formData);
}
// handleChosenInterests = e =>{
//     var user = this.state.user;
//     var newInterests:[].slice.call(e.target.selectedOptions).map(o => {
//         return o.value;
//     })
//     this.setState({
    
// });
//     console.log(this.state.interests);
//  }
  // componentDidMount(){
  //   const jwt = getJwt();
  //   this.setState
  // }

      // get interestsList
      componentDidMount() {
        getInterestsList().then(data => {
              let  interestsList = data.map(Interests => { return {value: Interests, display: Interests, label: Interests} })
                this.setState({ interestsList: [{value: '', display: '(Select your working Field)'}].concat(interestsList) });
              }).catch(err => {
                  if(err && err.data){
                    alert("Could not find interests: ",err.data.message);
                  }
            })	
        }

  render() {
    const {email,avatar, firstName, lastName, isSponsor, phone, biography } = this.props.user;
    return (
      <div className="wrap-login100 p-l-50 p-r-50 p-t-77 p-b-30">
     
          <form className="login100-form validate-form">
            <span className="login100-form-title p-b-55">
              Edit Information
            </span>

            <div
              className="wrap-input100 validate-input m-b-16"
              data-validate="Valid email is required: ex@abc.xyz"
            >
            <p>Email: {email}</p>
            <h1>hello</h1>
            </div>
            <Img className="profile" src={avatar}></Img>
            <input
                onChange={this.onChangeProfilePicture}
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                  />
            <div className="wrap-input100 validate-input m-b-16">
              <input
                className="input100"
                type="text"
                name="firstname"
                defaultValue={firstName}
                placeholder="first name"
                onChange={this.props.handleChange("firstname")}
                
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <span className="lnr lnr-user"></span>
              </span>
            </div>

            <div className="wrap-input100 validate-input m-b-16">
              <input
                className="input100"
                type="text"
                name="lastname"
                placeholder="last name"
                required="required"
                onChange={this.handleChange("lastname")}
                defaultValue={lastName}
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <span className="lnr lnr-user"></span>
              </span>
            </div>

            <div className="wrap-input100 validate-input m-b-16">
              <label>Phone number
              <input
                className="input100"
                type="tel"
                name="phone"
                placeholder="phone"
                onChange={this.handleChange("phone")}
                defaultValue={phone}
              /></label>
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <span className="lnr lnr-phone"></span>
              </span>
            </div>
            <div className="wrap-input100  m-b-16"
                    >
                      <label>Bio 
                    <input
                    className="input100"
                    type="text"
                    name="biography"
                    placeholder="Biography"
                    onChange={this.handleChange('biography')}
                    defaultValue = {biography}
                    /></label>
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                    <span className="lnr lnr-bio"></span>
                    </span>
                </div>
            {/* <div>
              <select value={user.workingField} onChange={this.props.handleChange("workingField")} >
                {values.interestsList.map(interest => (
                  <option key={interest.value} value={interest.value}>
                    {interest.display}
                  </option>
                ))}
              </select>
            </div> */}
            <div className="wrap-input100 validate-input m-b-16">
                <label> 
                    <input
                    type="checkbox"
                    name="isSponsor"
                    placeholder=""
                    onChange={this.handleIsSponsor}
                    defaultChecked={isSponsor}
                    /> Sponsor</label>
                    
                </div>
         
                <ReactMultiSelectCheckboxes options={this.state.interestsList} />

                

                {/* <div className="wrap-input100  m-b-16">
                <select multiple={true} value={user.interests}  onChange={this.props.handleChosenInterests} >
                {values.interestsList.map(interest => (
                  <option key={interest.value} value={interest.value}>
                    {interest.label}
                  </option>
                ))}
              </select>
                </div> */}

                <div className="container-login100-form-btn p-t-25">
                    <input type="submit" className="login100-form-btn" value="Save Changes" onClick={this.updateUser}/>
                </div>
          </form>
          </div>
     
    );
  }
}

export default editUserForm;
