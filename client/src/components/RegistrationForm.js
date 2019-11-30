import React, {Component} from "react";
import "../css/registration.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "../fonts/Linearicons-Free-v1.0.0/icon-font.min.css";
import UserBasicForm from "./UserBasicForm.js";
import UserAdditionalInformation from "./UserAdditionalInfo.js";
import axios from "axios";
import PropTypes from 'prop-types'

class RegistrationForm extends Component {
    state = { 
        step: 1,
        email: '',
        username: '',
        firstname: '',
        lastname: '',
        password: '',
        phone: '',
        biography: '',
        Interests:[],
        selectedInterests:[],
        selectedWorkingField:'',
        isSponsor: false,
     }

     static contextTypes = {
        router: PropTypes.object
      }
     //proceed to next step of registration
     nextStep = () => {
         const {step} = this.state;
         this.setState({
             step: step+1
         });
     }

     //Go back to previous step of registration
     previousStep = () => {
        const {step} = this.state;
        this.setState({
            step: step -1
        });
    }

    //Handle fields change
    handleChange = input => e => {
        this.setState({ [input]: e.target.value});
    }

    //handle isSponsor field change
    handleIsSponsor = () => {
        this.setState({ isSponsor: !this.state.isSponsor});
    }

    createUser = () =>{
        console.log("creating user");
        const { email, username, firstname, lastname,phone, password, biography, isSponsor } = this.state;
        const user = { email, username, firstname, lastname, password, phone,biography, isSponsor };
        axios.post('http://localhost:5000/user/register', user)
            .then((res) => {
                window.location="/profile"})
            .catch((e)=> {
                if (e.response && e.response.data) {
                    alert("Could not create Account: "+ e.response.data.message);
                }
            });
          
    }
  // get interestsList
    componentDidMount() {
		fetch('http://localhost:5000/user/interestsList')
		.then(res => res.json())
		.then(data => {
	
			   
               let  interestsList = data.map(Interests => { return {value: Interests, display: Interests, label: Interests} })
               this.setState({ Interests: [{value: '', display: '(Select your working field)'}].concat(interestsList) });
              


			    
			
		})
		.catch(err => {
           console.log(err);
           alert("Could not find interests");
        })	
    }

    render() { 
        const { step } = this.state;
        const { email, username, firstname, lastname,phone, password, biography,Interests, isSponsor } = this.state;
        const values = { email, username, firstname, lastname, password, phone,biography,Interests, isSponsor };
        
        switch(step){
            case 1:
                return ( 
                    <UserBasicForm
                        nextStep = {this.nextStep}
                        handleChange= {this.handleChange}
                        values = {values}
                        interests = {this.componentDidMount}
                    />
                 );
            case 2:
                return(
                    <UserAdditionalInformation
                        nextStep = {this.nextStep}
                        handleChange= {this.handleChange}
                        handleSponsorship = {this.handleIsSponsor}
                        sumbit = {this.createUser}
                        values = {values}
                    />
                    

                );
            default:
                return <h1> something went wrong</h1>
        }
        
    }
}
 
export default RegistrationForm;