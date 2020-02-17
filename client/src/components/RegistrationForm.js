import React, {Component} from "react";
import "../css/registration.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "../fonts/Linearicons-Free-v1.0.0/icon-font.min.css";
import UserBasicForm from "./UserBasicForm.js";
import UserAdditionalInformation from "./UserAdditionalInfo.js";
import PropTypes from 'prop-types';
import { getInterestsList, signup } from '../utils/APICalls';
import { AuthContext } from "../authContext";


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
        interests:[],
        interestsList:[],
        workingField:'',
        isSponsor: false,
     }
     static contextType = AuthContext;

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
        console.log(e.target.value);
    }

    //handle isSponsor field change
    handleIsSponsor = () => {
        this.setState({ isSponsor: !this.state.isSponsor});
    }
   
    handleChosenInterests =selectedOption=>{
       
          
        this.setState({
        interests:selectedOption
        
        
    });
   
      
     }

    createUser = () =>{
       

        const { email, username, firstname, lastname,phone, password, biography, isSponsor, workingField, interests } = this.state;
        let i = 0;
        let myInterests = {};
        for (i =0 ;i<interests.length;i++){
            myInterests = interests[i].value
        };
       
        const user = { email, username, firstname, lastname, password, phone,biography, isSponsor, workingField, myInterests };
        signup(user).then((data) => {
            this.context.initiateLogin(data);
            const path = '/users/'+data.user._id;
            this.props.history.push({pathname : path,
                state :{
                user: data.user,
                }});
          }).catch((e)=> {
                if (e && e.data) {
                    alert("Could not create Account: "+ e.data.message);
                }
            });
            
    }




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
        const { step } = this.state;
        const { email, username, firstname, lastname,phone, password, biography,interests,isSponsor, workingField,interestsList } = this.state;
        const values = { email, username, firstname, lastname, password, phone,biography,interests, isSponsor, workingField, interestsList };
       
        switch(step){
            case 1:
                return ( 
                    <div>
                    <UserBasicForm
                        nextStep = {this.nextStep}
                        handleChange= {this.handleChange}
                        values = {values}
                        interestsList = {this.componentDidMount}
                     
                    />
                    </div>
                 );
            case 2:
                return(
                    <div>
                    <UserAdditionalInformation
                        nextStep = {this.nextStep}
                        handleChange= {this.handleChange}
                        handleSponsorship = {this.handleIsSponsor}
                        sumbit = {this.createUser}
                        values = {values}
                        handleChosenInterests = {this.handleChosenInterests}
                    />
                    </div>
                    

                );
            default:
                return <h1> something went wrong</h1>
        }
        
    }
}
 
export default RegistrationForm;