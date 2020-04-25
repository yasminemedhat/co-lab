import React from 'react';

import onlineIcon from '../icons/onlineIcon.png';
import closeIcon from '../icons/closeIcon.png';
import {getChatHistory, sendChatMessage} from '../utils/APICalls';
import { AuthContext } from "../authContext";
import Message from './Message';
import socket from '../../src/utils/socket';
import '../css/Messages.css';
import '../css/Input.css';
import '../css/Chat.css';
import '../css/InfoBar.css';

class ChatRoom extends React.Component {
    static contextType = AuthContext;
    constructor(props) {
      super(props);
  
      this.state = {
        chatHistory: [],
        message: '',
        username: ''
      }
      this.boxRef = React.createRef()
  
      this.updateChatHistory = this.updateChatHistory.bind(this);
      // this.onMessageReceived = this.onMessageReceived.bind(this)
      this.sendMessage = this.sendMessage.bind(this);
 

    }
      
    componentDidMount() {
      this.setState({username: this.context.user.firstName + ' ' + this.context.user.lastName})
        getChatHistory(this.context.accessToken, this.props.colabId)
          .then(data => {
              this.setState({
                chatHistory: data
                });
                console.log(this.state.chatHistory);
          })
          .catch(err => {
              if (err && err.status) {
                alert("Could not get history: " + err.message);
              }
            });
        socket.on('new_message', this.updateChatHistory);
        this.scrollToBottom()
    }

  
     updateChatHistory(data){
        console.log("new message", data);
        this.setState({ chatHistory: this.state.chatHistory.concat(data) });
    }
  
    sendMessage = (event) => {
        event.preventDefault();
        if(this.state.message) {
            let message ={
                sender: this.context.user._id,
                body: this.state.message,
                collaboration: this.props.colabId,
                sender_username: this.state.username,
                sender_avatar: this.context.user.avatar
            }

          socket.emit('chatRoom_MSG', message);
          this.setState({message: ''});
          sendChatMessage(this.context.accessToken, this.props.colabId, {message: message.body})
            .then(data =>{
            });
        }
    } 
    handleChange = input => e => {
        this.setState({ [input]: e.target.value });
      };   
    
    toggleChat=() => {
      this.props.toggleChat();
    }
    scrollToBottom = () => {
      this.boxRef.current.scrollTop = this.boxRef.current.scrollHeight
  }

  componentDidUpdate = () => {
      this.scrollToBottom()
  }    
    
    render(){
        return(
        <div className="outerContainer">
            <div className= "containerr">
                <div className="infoBar">
                    <div className="leftInnerContainer">
                    <img className="onlineIcon" src={onlineIcon} alt="online icon" />
                     <h5>{this.props.colab_name}</h5>
                    </div>
                    <div className="rightInnerContainer">
                    <button onClick={()=> this.toggleChat()}><img src={closeIcon} alt="close icon" /></button>
                    </div>
                </div> 
                <div ref={this.boxRef} style={{overflowY: 'scroll', height:'400px', paddingBottom: "10px"}} >
                    {this.state.chatHistory.map((message, i) => <div key={i} style={{margin: '10px'}}><Message message={message} user_id={this.context.user._id} /></div>)}
                </div> 
                <form className="chatForm">
                    <input
                    className="input"
                    type="text"
                    placeholder="Type a message..."
                    value={this.state.message}
                    onChange={this.handleChange("message")}
                    onKeyPress={event => event.key === 'Enter' ? this.sendMessage(event) : null}
                    />
                    <button className="sendButton" onClick={(e) => this.sendMessage(e)}>Send</button>
                </form>
            </div>
        </div>  )
    }

}
export default ChatRoom;