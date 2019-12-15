import React, { Component } from "react";
import { getUser } from '../utils/APICalls';
import { getJwt } from "../helpers/jwt";

class editUserForm extends Component {
  state={
      user: undefined
  }

  constructor(props){
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.handleIsSponsor = this.handleIsSponsor.bind(this);
  }
  //Handle fields change
  handleChange = input => e => {
    var user = this.state.user;
    user[input] = e.target.value;
    this.setState({ user});
}

//handle isSponsor field change
handleIsSponsor = () => {
    var user = this.state.user;
    user.isSponsor = !user.isSponsor
    this.setState({ user});
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
  componentDidMount(){
    const jwt = getJwt();
    getUser(jwt).then(res => {
        this.setState({user: res.user})
      })
      .catch(err => {
        if (err && err.status) {
          alert("Could not get user: " + err.message);
        }
      });
  }

  render() {
    const user = this.state.user;
    if(user === undefined){
        return(
        <div><h1>loading...</h1></div>
        );
    }
    return (
          <form className="login100-form validate-form">
            <span className="login100-form-title p-b-55">
              Edit Information
            </span>

            <div
              className="wrap-input100 validate-input m-b-16"
              data-validate="Valid email is required: ex@abc.xyz"
            >
            <p>Email: {user.email}</p>
            </div>
            <Img className="profile" src={this.state.user.profilePictureUrl}></Img>
            <input
                // onChange={this.onChangeProfilePicture}
                type="file"
                name="profilePicture"
                accept="image/png, image/jpeg, image/jpg"
                  />
            <div className="wrap-input100 validate-input m-b-16">
              <input
                className="input100"
                type="text"
                required
                name="firstname"
                placeholder="first name"
                onChange={this.props.handleChange("firstname")}
                value={user.firstname}
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
                onChange={this.props.handleChange("lastname")}
                value={user.lastname}
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <span className="lnr lnr-user"></span>
              </span>
            </div>

            <div className="wrap-input100 validate-input m-b-16">
              <input
                className="input100"
                type="tel"
                name="phone"
                placeholder="phone"
                onChange={this.props.handleChange("phone")}
                value={values.phone}
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <span className="lnr lnr-phone"></span>
              </span>
            </div>

            <div>
              <select value={user.workingField} onChange={this.props.handleChange("workingField")} >
                {values.interestsList.map(interest => (
                  <option key={interest.value} value={interest.value}>
                    {interest.display}
                  </option>
                ))}
              </select>
            </div>
            <div className="wrap-input100 validate-input m-b-16">
                <label> 
                    <input
                    type="checkbox"
                    required
                    name="isSponsor"
                    placeholder=""
                    onChange={this.props.handleSponsorship}
                    defaultChecked={user.isSponsor}
                    /> Sponsor</label>
                    
                </div>


                <div className="wrap-input100  m-b-16"
                    >
                    <input
                    className="input100"
                    type="text"
                    name="biography"
                    placeholder="Biography"
                    onChange={this.props.handleChange('biography')}
                    value = {user.biography}
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                    <span className="lnr lnr-bio"></span>
                    </span>
                </div>

                <div className="wrap-input100  m-b-16">
                <select multiple={true} value={user.interests}  onChange={this.props.handleChosenInterests} >
                {values.interestsList.map(interest => (
                  <option key={interest.value} value={interest.value}>
                    {interest.label}
                  </option>
                ))}
              </select>
                </div>

                <div className="container-login100-form-btn p-t-25">
                    <input type="submit" className="login100-form-btn" value="Create Account" onClick={this.continue}/>
                </div>
          </form>
     
    );
  }
}

export default editUserForm;
