import React, { useState, useEffect} from "react";
import "../css/ProjectPage.css";
import "../css/createProject.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import Img from "react-image";
import { Row, Col , Table} from "react-bootstrap";
import Image from 'react-bootstrap/Image';
import Linkify from "react-linkify";


const ColabDetails = (props) => {
    const [colab, setColab] = useState({name: '', description: '', members: [], images: []});

    useEffect(() => {
        let images = props.location.state.collaboration.images ? props.location.state.collaboration.images : [];
        setColab({...props.location.state.collaboration, images});
    },[]);
    
    const gotToMemberProfile = memberId => {
        let path = "/users/"+memberId;
        props.history.push({
        pathname : path
        });
    }

    var content='';
    if(colab.name === ''){
        content = (<div><h1>loading...</h1></div>);
    }
    else {
        let row= [];
        let rowIndex = -1
        for (let i=0;i<colab.images.length;i= i+3){
            rowIndex++
            row[rowIndex] = 
                <div className="row imageRow" key={i}>
                    <div className = "col imagecol">
                    <Img className="project_pictures" style={{ float: 'right'}} src={colab.images[i]}></Img>
                    </div>
                    <div className = "col imagecol">
                    <Img className="project_pictures" src={colab.images[i+1]}></Img>
                    </div>
                    <div className = "col imagecol">
                    <Img className="project_pictures" style={{ float: 'left'}} src={colab.images[i+2]}></Img>
                    </div>  
                </div>
        }    
        // let members = [];
        // for(let i=0;i<colab.members.length; i++){
        // members[i] = <div key={i}><h3>{colab.members[i].firstName} {colab.members[i].lastName}</h3></div>
        // }
        let table = (<Table striped bordered hover style={{backgroundColor: "white", width: "30%"}}>
                        <tbody>
                            {colab.members.map(member => {
                                return (
                                <tr key={member._id}>
                                <td tag='a' onClick={gotToMemberProfile.bind(null, member._id)} style={{cursor: "pointer"}} >
                                {member.avatar ? (<Image className="navbarAvatar" src={member.avatar} style={{width: 45, height: 45, margin:"5px"}} roundedCircle ></Image>) : (
                                <Image className="navbarAvatar" src={require("../images/profile.png")} style={{width: 45, height: 45, margin:"5px"}} roundedCircle></Image>)}
              
                                    {member.firstName} {member.lastName}</td>
                                </tr>)})}
                            
                            
                        </tbody>
                        </Table>);
        content =(<Row>
                    <div className="ProjectContainer">
                    <div>
                        <div className="col"></div>
                        <Col style={{width: "50%"}} >
                            <h1>{colab.name}</h1>
                            <p>{colab.description}</p>
                            <Linkify>{colab.link}</Linkify>
                        </Col>
                        
                        <Col>
                        <h1>Members</h1><br></br>
                        <div>{table}</div>
                        </Col>
                        
                        <div className="col"></div>
                    </div>
                    <Row style={{marginTop: "30px"}}>{row}</Row>
                </div></Row>)
    
    }
    
    return content;
      
}
export default ColabDetails;