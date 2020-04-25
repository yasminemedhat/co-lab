import React from 'react';
import Image from 'react-bootstrap/Image';
import '../css/Message.css';

import ReactEmoji from 'react-emoji';

const Message = ({message, user_id}) => {
  let isSentByCurrentUser = false;


  if(user_id === message.sender) {
    isSentByCurrentUser = true;
  }

  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer justifyEnd">
         
          <div className="sentText pr-10"></div>
          <div className="messageBox backgroundBlue">
            <p className="messageText colorWhite">{ReactEmoji.emojify(message.body)}</p>
          </div>
        </div>
        )
        : ( <div>
          <div className="sentText pl-10 ">{message.sender_username}</div> 
       
             <div className="messageContainer justifyStart">
            <Image
              className='navbarAvatar'
              src={
                message.sender_avatar
                  ? message.sender_avatar
                  : require('../images/profile.png')
              }
              style={{ width: 30, height: 30, margin: '1px' }}
              roundedCircle
            ></Image>
            <div className="messageBox backgroundLight">
              <p className="messageText colorDark">{ReactEmoji.emojify(message.body)}</p>
            </div>
            </div>
          </div>
        )
  );
}

export default Message;