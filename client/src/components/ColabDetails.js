import React, { useState, useEffect } from "react";
import "../css/ProjectPage.css";
import "../css/createProject.css";
import "../css/main.css";
import "../bootstrap/css/bootstrap.min.css";
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import { Row, Table } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import Linkify from "react-linkify";
import { AuthConsumer } from "../authContext";
import Can from "./Can";
import AddMemberPopup from "./AddMemberPopUp";
import { getJwt , getUserStored} from "../helpers/jwt";
import { addColabMember, getCollaboration,likeProject } from "../utils/APICalls";
import Gallery from "react-grid-gallery";
import ProjectReview from "./ProjectReview"
import socket from '../utils/socket';
import ChatRoom from "./ChatRoom";
import { FaChat } from 'react-icons/fa';

const ColabDetails = props => {
  const [colab, setColab] = useState({
    name: "",
    description: "",
    members: [],
    images: []
  });

  const [popUp, setPopUp] = useState({ showPopUp: false });
  const [chat, setChat] = useState({ showChat: false });
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [update, setUpdate] = useState(false);
  const [likes , setLikes] = useState({likeButton: true,likesCount: 0});
  let IMAGES = [{}];

  useEffect(() => {
    
    const jwt = getJwt();
    const user = getUserStored();
    getCollaboration(jwt, props.match.params.id)
      .then(collaboration => {
        let images = collaboration.images ? collaboration.images : [];
        setColab({ ...collaboration, images });
        if(collaboration.likes.length> 0 && collaboration.likes.includes(user._id)) {
          setLikes({likeButton:false,likesCount: collaboration.likes.length});
        }
        else{
          setLikes({likeButton:true,likesCount: collaboration.likes.length});
        }
        
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

  const editColaboration = () => {
    let path = "/collaborations/" + colab._id + "/edit";
    props.history.push({
      pathname: path,
      state: {
        collaboration: colab
      }
    });
  };

  const toggleLikeProject =() => {
    const jwt = getJwt();
   likeProject(jwt, props.match.params.id)
   .then(colab => {
     var liked = !likes.likeButton;
     var count = likes.likesCount;
     setLikes({likeButton: liked,likesCount: count});
     if(liked){
       setLikes({likeButton: liked,likesCount: count -1})
     }else{
      setLikes({likeButton: liked,likesCount: count +1})
     }
   })
   .catch(err => {
     if(err && err.status){
       alert("something went wrong: " + err.message);
     }
   })
 }

 const sendMessage = (user) => {
    // ev.preventDefault();
    console.log('sendigngg: ');
    let sender_username = user.firstName + " " + user.lastName;
    socket.emit('chatRoom_MSG', {
        sender: user._id,
        body: 'hello world',
        collaboration: colab._id,
        sender_username,
        sender_avatar: user.avatar
    });
    // this.setState({message: ''});
 }
  const togglePopup = () => {
    setPopUp({ showPopUp: !popUp.showPopUp });
  };
  const toggleChat = () => {
    setChat({ showChat: !chat.showChat });
    console.log('chat toggled, ', chat.showChat);
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
      IMAGES.push({
        src: colab.images[i],
        thumbnail: colab.images[i],

        thumbnailWidth: 250,
        thumbnailHeight: 212
      });
    }
    IMAGES = IMAGES.slice(1,IMAGES.length)
    // let members = [];
    // for(let i=0;i<colab.members.length; i++){
    // members[i] = <div key={i}><h3>{colab.members[i].firstName} {colab.members[i].lastName}</h3></div>
    // }
    let table = (
      <Table
        striped
        bordered
        hover
        style={{ backgroundColor: "white", width: "100%" }}
      >
        <tbody>
          {colab.members.map(member => {
            return (
              <tr key={member._id}    style={{ height: 50}}>
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
            <div className="ColabContainer">
              <Row>
                <div style={{ width: "80%", padding:"1%"}}>
                  <h1>{colab.name}</h1>
                  <p>{colab.description}</p>
                  <Linkify>{colab.link}</Linkify>
                </div>
                
                <div  style={{ float: "right", width: "20%" , padding:"1%"}}>
                <Row  style={{width: "100%" }}>
                  <button
                    style={{ float: "right", width: "180px" }}
                    className="profile-btn"
                    onClick={editColaboration.bind(null, colab)}
                  >
                    Edit Co-Laboration
                  </button>
              </Row>
              <Can
                role={user.userType}
                perform="collaborations:addMember"
                data={{
                  userId: user._id,
                  members: colab.members
                }}
                yes={() => (
                  <Row style={{width: "100%" }}>
                 
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
             
                  </Row>
                )}
              />
              <Row>
              {likes.likeButton=== true ? <button
                  style={{ float: "right", width: "180px" }}
                  className="profile-btn like__btn"
                  onClick={toggleLikeProject.bind(null)}
                >
                    <i className="like__icon fa fa-heart"></i>
                    <span className="like__number">{likes.likesCount}</span>
                    </button> : <button
                    style={{ float: "right", width: "180px" }}
                    className="profile-btn unlike-button"
                    onClick={toggleLikeProject.bind(null)}
                  >
                  <i className="liked__icon fa fa-heart"></i>
                  <span className="like__number">{likes.likesCount}</span>
                  </button>}
              </Row>
              <Can
                role={user.userType}
                perform="collaborations:addMember"
                data={{
                  userId: user._id,
                  members: colab.members
                }}
                yes={() => (
                  <Row style={{width: "100%" }}>
                 
                      <button
                        style={{ float: "right", width: "180px" }}
                        className="profile-btn"
                        onClick={sendMessage.bind(null,user)}
                      >
                        send to members
                      </button>
             
                  </Row>
                )}
              />
                </div>
              
              </Row>

              <Row>
              <div style={{ float: "left", width: "75%" }}></div>
              <h3 style={{ float: "right", width: "25%" , padding:"2%" }} >Members</h3>
              </Row>
             

              <Row>
                <div style={{ float: "left", width: "75%" }}>
                <Gallery
                images={IMAGES}
                backdropClosesModal={true}
                enableLightbox={true}
                enableImageSelection={false}
              />
                </div>
             
               
                <div  style={{ float: "right", width: "25%" , paddingRight:"2%", paddingLeft:"2%" }} >
                 
                
                  <div>{table}</div>
                </div>
              </Row>
              {chat.showChat ? <ChatRoom colabId={colab._id} colab_name={colab.name} toggleChat={toggleChat.bind(null)}></ChatRoom>
              : <button className="chatButton" onClick={toggleChat.bind(null)}><i className='fa fa-comments fa-4x'></i></button>}
              
             
              <div className="row">
            <h2>Reviews</h2>
          </div>
          <div className ="row ReviewDiv">
          
            <ProjectReview project = {colab} user = {user}></ProjectReview>
          </div>
            </div>
          );
        }}
       
      </AuthConsumer>
    );
  }

  return content;
};
export default ColabDetails;
