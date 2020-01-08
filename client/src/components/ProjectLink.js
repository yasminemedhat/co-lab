import React, { Component } from "react";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import Linkify from "react-linkify";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { withRouter} from 'react-router-dom';

class ProjectLink extends Component {
    state={
        name: "",
        description: "",
        link: "",
        imageUrl: "",
        id: ''
    };
    constructor(props){
        super(props);
        this.showProjectDetails = this.showProjectDetails.bind(this);
    }
    showProjectDetails = () => {
        const path = "/projects/"+ this.state.id;
        const project = this.props.project;
        this.props.history.push({
          pathname : path,
          state :{
          project: project,
          }
          });
      };
    
    componentDidMount(){
        const {name, description, link, _id} = this.props.project;
        const image = this.props.project.images ? this.props.project.images[0] : require('../images/img-01.png')
        console.log("image: ", image);
        this.setState({name,description,link,image, id: _id});
    }
    render() { 
        return (
                <Card tag='a'
                onClick={() => {this.showProjectDetails()}} 
                style={{  cursor: "pointer",width: '18rem', height: '25rem', margin: "10px"  }}>
                    <Card.Img style={{ width: '18rem', height: '15rem'}} variant="top" src={this.state.image} />
                    <Card.Body>
                        <Card.Title>{this.props.project.name}</Card.Title>
                        <Card.Text>{this.props.project.description}</Card.Text>
                        {this.props.project.link? (<Linkify>{this.props.project.link}</Linkify>) : null}
                    </Card.Body>
                </Card>
            );
    }
}
export default withRouter(ProjectLink);