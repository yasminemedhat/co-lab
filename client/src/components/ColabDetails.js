import React, { useState, useEffect } from "react";
import "../css/ProjectPage.css";
import "../css/createProject.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import { Row, Col, Table } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import Linkify from "react-linkify";
import { AuthConsumer } from "../authContext";
import Can from "./Can";
import AddMemberPopup from "./AddMemberPopUp";
import { getJwt } from "../helpers/jwt";
import { addColabMember, getCollaboration } from "../utils/APICalls";
import Gallery from "react-grid-gallery";



const ColabDetails = props => {

  const [colab, setColab] = useState({
    name: "",
    description: "",
    members: [],
    images: []
  });



  const [popUp, setPopUp] = useState({ showPopUp: false });
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [update, setUpdate] = useState(false);
  const IMAGES = [{}]


  useEffect(() => {
    const jwt = getJwt();
    getCollaboration(jwt, props.match.params.id)
      .then(collaboration => {
        let images = collaboration.images ? collaboration.images : [];
        setColab({ ...collaboration, images });
      })
      .catch(err => {
        alert("could not find colab");
      });
  }, [update]);

  const gotToMemberProfile = memberId => {
    let path = "/users/" + memberId;
    props.history.push({
      pathname: path
    });
  };

 const editColaboration = colab =>{

    let path = "/collaborations/" + colab._id + "/EditCollaboration" ;
    props.history.push({
      pathname: path,
      state: {
        collaboration: colab
      }
     
    });
 }


  const togglePopup = () => {
    setPopUp({ showPopUp: !popUp.showPopUp });
  };
  const addMember = () => {
    const jwt = getJwt();
    const emailObj = { email: newMemberEmail };
    addColabMember(jwt, colab._id, emailObj)
      .then(data => {
        if (data === "Colaber not found") {
          alert("There is no co-laber with that email");
        } else if (data === "Colaber already a member of this Collaboration.") {
          alert("This Colaber already a member of this Collaboration.");
        } else {
          setUpdate(!update);
        }
      })
      .catch(err => {
        alert(err.message);
      });
    setPopUp({ showPopUp: false });
  };
  const onEmailChange = event => {
    // console.log("on change",event.target.value);
    const email = event.target.value;
    console.log(email);
    setNewMemberEmail(email);
  };

  var content = "";
  if (colab.name === "") {
    content = (
      <div>
        <h1>loading...</h1>
      </div>
    );
  } else {
    

    for (let i = 0; i < colab.images.length; i = i + 1) {
      IMAGES.push({src:colab.images[i], thumbnail:colab.images[i],
       
      thumbnailWidth: 250,
      thumbnailHeight: 212,})
    }
    // let members = [];
    // for(let i=0;i<colab.members.length; i++){
    // members[i] = <div key={i}><h3>{colab.members[i].firstName} {colab.members[i].lastName}</h3></div>
    // }
    let table = (
      <Table
        striped
        bordered
        hover
        style={{ backgroundColor: "white", width: "30%" }}
      >
        <tbody>
          {colab.members.map(member => {
            return (
              <tr key={member._id}>
                <td
                  tag="a"
                  onClick={gotToMemberProfile.bind(null, member._id)}
                  style={{ cursor: "pointer" }}
                >
                  {member.avatar ? (
                    <Image
                      className="navbarAvatar"
                      src={member.avatar}
                      style={{ width: 45, height: 45, margin: "5px" }}
                      roundedCircle
                    ></Image>
                  ) : (
                    <Image
                      className="navbarAvatar"
                      src={require("../images/profile.png")}
                      style={{ width: 45, height: 45, margin: "5px" }}
                      roundedCircle
                    ></Image>
                  )}
                  {member.firstName} {member.lastName}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
    content = (
      <AuthConsumer>
        {({ user }) => {
          return (
            <Row>
              <div className="ProjectContainer">
                <Can
                  role={user.userType}
                  perform="collaborations:addMember"
                  data={{
                    userId: user._id,
                    members: colab.members
                  }}
                  yes={() => (
                    <Row style={{ width: "100%" }}>
                      <Col>
                        <button
                          style={{ float: "right", width: "180px" }}
                          className="profile-btn"
                          onClick={togglePopup.bind(null)}
                        >
                          Add Member
                        </button>
                        {popUp.showPopUp ? (
                          <AddMemberPopup
                            closePopup={togglePopup.bind(null)}
                            handleSubmit={addMember.bind(null, newMemberEmail)}
                            handleChange={onEmailChange.bind(null)}
                            email={newMemberEmail}
                            closePopUp={togglePopup.bind(null)}
                          />
                        ) : null}
                      </Col>
                    </Row>
                  )}
                />
            
                <div>
             
                
               
                  <div className="col">
                  <button
                    style={{ float: "right", width: "180px" }}
                    className="profile-btn"
                    onClick={editColaboration.bind(null, colab)}
                  
                  >
                    Edit Co-Laboration
                  </button>
                  </div>

                  <Col style={{ width: "50%" }}>
                    <h1>{colab.name}</h1>
                    <p>{colab.description}</p>
                    <Linkify>{colab.link}</Linkify>
                  </Col>

                  <Col>
                    <h1>Members</h1>
                    <br></br>
                    <div>{table}</div>
                  </Col>

                  <div className="col"></div>
                </div>
                <Gallery images={IMAGES} backdropClosesModal ={true}  enableLightbox={true}
                    enableImageSelection={false} />
              </div>
            </Row>
          );
        }}
      </AuthConsumer>
    );
  }

  return content;
};
export default ColabDetails;
