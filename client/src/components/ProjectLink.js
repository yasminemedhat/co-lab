import React, { Component } from "react";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import Linkify from "react-linkify";
// import { Card, Button } from 'reactstrap';
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

class ProjectLink extends Component {
    render() { 
        return (
                <Card style={{ width: '18rem', height: '18rem', margin: "10px"  }}>
                    {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                    <Card.Body>
                        <Card.Title>{this.props.project.name}</Card.Title>
                        <Card.Text>{this.props.project.description}</Card.Text>
                        {this.props.project.link? (<Linkify>{this.props.project.link}</Linkify>) : null}
                        <Button variant="primary">show project</Button>
                    </Card.Body>
                </Card>
            );
    }
}
export default ProjectLink;