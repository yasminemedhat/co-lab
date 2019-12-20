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
        imageUrl: ""
    };
    constructor(props){
        super(props);
        this.routeChange = this.routeChange.bind(this);
    }
    routeChange = () => {
        const path = "/ProjectPage";
        const project = this.props.project;
        this.props.history.push({
          pathname : path,
          state :{
          project: project,
          }
          });
      };
    
    componentDidMount(){
        const {name, description, link} = this.props.project;
        const image = this.props.project.images ? this.props.project.images[0] : require('../images/img-01.png')
        console.log("image: ", image);
        this.setState({name,description,link,image});
    }
    render() { 
        return (
                <Card style={{ width: '18rem', height: '25rem', margin: "10px"  }}>
                    <Card.Img style={{ width: '18rem', height: '15rem'}} variant="top" src={this.state.image} />
                    <Card.Body>
                        <Card.Title>{this.props.project.name}</Card.Title>
                        <Card.Text>{this.props.project.description}</Card.Text>
                        {this.props.project.link? (<Linkify>{this.props.project.link}</Linkify>) : null}
                        <Button variant="primary"  onClick={this.routeChange}>show project</Button>
                    </Card.Body>
                </Card>
            );
    }
}
export default withRouter(ProjectLink);