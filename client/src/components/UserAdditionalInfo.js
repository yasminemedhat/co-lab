import React, {Component} from "react";
import "../css/registration.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
// import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';

class UserAdditionalInformation extends Component {

    constructor() {

        super();
        this.quickhire = this.quickhire.bind(this);

        this.state = {

            showquickHire: false,
        };

    }

    continue = e => {
        e.preventDefault();
        
          this.props.sumbit();
        }
  
    quickhire =e=>{
       
    this.setState({
        showquickHire: e.target.checked,
    });
    }
 
              
    render() {
        const { values } = this.props;
        return (
            <div className="main_container">
            <div className="wrap-registration100 p-l-50 p-r-50 p-t-77 p-b-30">
                <form className="login100-form validate-form">
                <span className="login100-form-title p-b-55">Additional Information</span>


                <div
                    className="wrap-input100 validate-input m-b-16"
                >
                <label> 
                    <input
                    type="checkbox"
                    required
                    name="isSponsor"
                    placeholder=""
                    onChange={this.props.handleSponsorship}
                    defaultChecked={values.isSponsor}
                    /> Do you want to sponsor projects?</label>
                    
                </div>


                <div className="wrap-input100  m-b-16"
                    >
                    <input
                    className="input100"
                    type="text"
                    name="biography"
                    placeholder="Biography"
                    onChange={this.props.handleChange('biography')}
                    defaultValue = {values.biography}
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                    <span className="lnr lnr-bio"></span>
                    </span>
                </div>



             
                <ReactMultiSelectCheckboxes options={values.interestsList} onChange={this.props.handleChosenInterests} placeholderButtonLabel='Choose your Interests'/>
               <div className="row">
               <div
                    className="wrap-input100 validate-input m-b-16"
                >
                <label> 
                    <input
                    type="checkbox"
                    required
                    name="QuickHire"
                    placeholder=""
                    onChange={this.quickhire}
                    
                    /> Interested in Quick-Hires?</label>
                    
                </div>
               </div>
               {this.state.showquickHire? <div className="row">
                <ReactMultiSelectCheckboxes  className="ReactMultiSelectCheckboxes" options={values.hireFields} onChange={this.props.handleChosenHireFields} placeholderButtonLabel='Choose your hiring fields'/>

                </div>: null}

                <div className="container-login100-form-btn p-t-25">
                    <input type="submit" className="login100-form-btn" value="Create Account" onClick={this.continue}/>
                </div>
                </form>
            </div>
            </div>
            );
    }
}
 
export default UserAdditionalInformation;