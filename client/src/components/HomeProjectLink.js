import React, { useState, useEffect} from "react";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import Linkify from "react-linkify";
import Card from "react-bootstrap/Card";
// import Button from "react-bootstrap/Button";
// import { withRouter} from 'react-router-dom';

const HomeProjectLink = props => {
    const [state, setState]= useState({ 
        name: "",
        description: "",
        link: "",
        image: "",
        project: {}});

    useEffect(() => {
        let {name, description, link} = props.project;
        let project = props.project;
        let image ='';
        if(props.project.images){
             image = props.project.images[0];
        }
        setState({name,description,link,image, project});
    },[]);

    var content;
    if(state.name === ''){
        content = (<div><h1>loading...</h1></div>);
    }
    else{
        content = (
        <Card tag='a'
            onClick={() => {props.showProjectDetails(state.project)}} 
            style={{ cursor: "pointer", width: '18rem', height: '25rem', margin: "10px"  }}>
                {state.image ? (<Card.Img  style={{ width: '18rem', height: '15rem'}} variant="top" src={state.image} />)
                    : state.project.projectType ? (<Card.Img  style={{ width: '18rem', height: '15rem'}} variant="top" src={require('../images/collaboration.jpeg')} />) 
                    : (<Card.Img  style={{ width: '18rem', height: '15rem'}} variant="top" src={require('../images/project.png')} />) }
                    
                    <Card.Body>
                        <Card.Title>{state.name}</Card.Title>
                        <Card.Text>{state.description}</Card.Text>
                        {state.link? (<Linkify>{state.link}</Linkify>) : null}
                    </Card.Body>
                </Card>
        );
    }
    return content;
}
export default HomeProjectLink;