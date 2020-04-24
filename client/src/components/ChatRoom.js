import React from 'react';

import onlineIcon from '../icons/onlineIcon.png';
import closeIcon from '../icons/closeIcon.png';
import {getChatHistory} from '../utils/APICalls';
import ScrollToBottom from 'react-scroll-to-bottom';
import { AuthContext } from "../authContext";
import Message from './Message';
import socket from '../../src/utils/socket';
import '../css/Messages.css';
import '../css/Input.css';
import '../css/Chat.css';
import '../css/InfoBar.css';

class ChatRoom extends React.Component {
    static contextType = AuthContext;
    constructor(props, context) {
      super(props, context)
  
      const { chatHistory } = props
  
      this.state = {
        history: [],
        message: '',
        username: ''
      }
  
      this.updateChatHistory = this.updateChatHistory.bind(this)
      this.onMessageReceived = this.onMessageReceived.bind(this)
      this.onSendMessage = this.onSendMessage.bind(this)
 

    }
      
    componentDidMount() {
    //   this.props.registerHandler(this.onMessageReceived)
      this.setState({username: this.context.user.firstName + ' ' + this.context.user.lastName})
        getChatHistory(this.context.accessToken, this.props.colabId)
            .then(data => {
                this.setState({
                    history: data
                  });
            })
            .catch(err => {
                if (err && err.status) {
                  alert("Could not get history: " + err.message);
                }
              });
    }
  
    // componentDidUpdate() {
    //   this.scrollChatToBottom()
    // }
  
    // componentWillUnmount() {
    //   this.props.unregisterHandler()
    // }
  
    updateChatHistory(entry) {
      this.setState({ chatHistory: this.state.chatHistory.concat(entry) })
    }
      
    onMessageReceived(entry) {
      this.updateChatHistory(entry)
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
          socket.emit('chatRoom_MSG', message, () => this.setState({message: ''}));
        }
    } 
    handleChange = input => e => {
        this.setState({ [input]: e.target.value });
      };    
   
    onSendMessage() {
      if (!this.state.input)
        return
  
      this.props.onSendMessage(this.state.input, (err) => {
        if (err)
          return console.error(err)
  
        return this.setState({ input: '' })
      })
    }
    
    
    render(){
        return(
        <div className="outerContainer">
            <div classNAme= "containerr">
                <div className="infoBar">
                    <div className="leftInnerContainer">
                    <img className="onlineIcon" src={onlineIcon} alt="online icon" />
                    <h3>chat room</h3>
                    </div>
                    <div className="rightInnerContainer">
                    <a href="/"><img src={closeIcon} alt="close icon" /></a>
                    </div>
                </div> 
                <ScrollToBottom className="messages">
                    {this.state.history.map((message, i) => <div key={i}><Message message={message} user_id={this.context.user._id} /></div>)}
                </ScrollToBottom> 
                <form className="chatForm">
                    <input
                    className="input"
                    type="text"
                    placeholder="Type a message..."
                    value={this.state.message}
                    onChange={this.handleChange("message")}
                    onKeyPress={event => event.key === 'Enter' ? this.sendMessage(event) : null}
                    />
                    <button className="sendButton" onClick={e => this.sendMessage(e)}>Send</button>
                </form>
            </div>
        </div>  )
    }

}
export default ChatRoom;