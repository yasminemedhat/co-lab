import React, { useState, useEffect} from "react";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import Linkify from "react-linkify";
import Card from "react-bootstrap/Card";
// import Button from "react-bootstrap/Button";
// import { withRouter} from 'react-router-dom';

const ColabLink = props => {
    const [state, setState]= useState({ 
        name: "",
        description: "",
        link: "",
        image: "",
        collaboration: {}});

    useEffect(() => {
        let {name, description, link, showDetails} = props.collaboration;
        let collaboration = props.collaboration;
        let image = props.collaboration.images ? props.collaboration.images[0] : require('../images/img-01.png');
        setState({name,description,link,image, showDetails, collaboration});
    },[]);

    var content;
    if(state.name === ''){
        content = (<div><h1>loading...</h1></div>);
    }
    else{
        content = (
        <Card tag='a'
            onClick={() => {props.showDetails(state.collaboration)}} 
            style={{ cursor: "pointer", width: '15rem', height: '25rem', margin: "10px"  }}>
                    <Card.Img  style={{ width: '15rem', height: '15rem'}} variant="top" src={state.image} />
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
export default ColabLink;