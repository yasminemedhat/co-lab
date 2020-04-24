import React from 'react';

import '../css/Message.css';

import ReactEmoji from 'react-emoji';

const Message = ({ message, user_id}) => {
  let isSentByCurrentUser = false;


  if(user_id === message.sender) {
    isSentByCurrentUser = true;
  }

  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer justifyEnd">
          <p className="sentText pr-10">{message.username}</p>
          <div className="messageBox backgroundBlue">
            <p className="messageText colorWhite">{ReactEmoji.emojify(message.body)}</p>
          </div>
        </div>
        )
        : (
          <div className="messageContainer justifyStart">
            <div className="messageBox backgroundLight">
              <p className="messageText colorDark">{ReactEmoji.emojify(message.body)}</p>
            </div>
            <p className="sentText pl-10 ">{message.username}</p>
          </div>
        )
  );
}

export default Message;