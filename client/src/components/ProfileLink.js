import React, { Component } from "react";
import "../bootstrap/css/bootstrap.min.css";
import "../css/ProjectPage.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import Linkify from "react-linkify";
import Card from "react-bootstrap/Card";
import { withRouter} from 'react-router-dom';

class ProfileLink extends Component {
    
    constructor(props){
        super(props);
        this.state={
            firstName: "",
            avatar: "",
            lastName: "",
            id: ''
        };
        this.showColaberDetails = this.showColaberDetails.bind(this);
    }
    showColaberDetails = () => {
        const path = "/users/"+ this.state.id;
        const colaber = this.props.colaber;
        this.props.history.push({
          pathname : path,
          state :{
          colaber: colaber,
          }
          });
      };
    
    componentDidMount(){
        const {firstName, lastName, _id} = this.props.colaber;
        const avatar = this.props.colaber.avatar ? this.props.colaber.avatar : require('../images/img-01.png')
        console.log("image: ", avatar);
        this.setState({firstName,lastName,avatar, id: _id});
    }
    render() { 
        if(this.state.name === ''){
            return(<div><h1>loading...</h1></div>);
        }
        return (
                <Card tag='a'
                onClick={() => {this.showColaberDetails()}} 
                className="projectCard"
                style={{  cursor: "pointer",width: '15rem', height: '25rem', margin: "10px" ,float:"left"  }}>
                    <Card.Img style={{ width: '15rem', height: '15rem'}} variant="top" src={this.state.avatar} />
                    <Card.Body>
                        <Card.Title>{this.state.firstName} {this.state.lastName}</Card.Title>
                       
                       
                    </Card.Body>
                </Card>
            );
    }
}
export default withRouter(ProfileLink);