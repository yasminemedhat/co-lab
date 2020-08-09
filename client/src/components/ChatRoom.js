import React from "react";

import onlineIcon from "../icons/onlineIcon.png";
import closeIcon from "../icons/closeIcon.png";
import { getChatHistory, sendChatMessage } from "../utils/APICalls";
import { AuthContext } from "../authContext";
import Message from "./Message";
import socket from "../../src/utils/socket";
import "../css/Messages.css";
import "../css/Input.css";
import "../css/Chat.css";
import "../css/InfoBar.css";

class ChatRoom extends React.Component {
	static contextType = AuthContext;
	constructor(props) {
		super(props);

		this.state = {
			chatHistory: [],
			message: "",
			username: "",
			page: 1,
		};
		this.boxRef = React.createRef();

		this.updateChatHistory = this.updateChatHistory.bind(this);
		// this.onMessageReceived = this.onMessageReceived.bind(this)
		this.sendMessage = this.sendMessage.bind(this);
	}

	componentDidMount() {
		this.setState({
			username: this.context.user.firstName + " " + this.context.user.lastName,
		});
		getChatHistory(
			this.context.accessToken,
			this.props.colabId,
			this.state.page
		)
			.then((data) => {
				var chatArr = data;
				chatArr.reverse();
				this.setState({
					chatHistory: chatArr,
				});
				this.scrollToBottom();
			})
			.catch((err) => {
				if (err && err.status) {
					alert("Could not get history: " + err.message);
				}
			});
		socket.on("new_message", this.updateChatHistory);
		document
			.getElementById("chatBox")
			.addEventListener("scroll", this.trackScrolling);
		this.scrollToBottom();
	}

	componentWillUnmount() {
		document
			.getElementById("chatBox")
			.removeEventListener("scroll", this.trackScrolling);
	}

	isTop() {
		return this.boxRef.current.scrollTop == 0;
	}

	incrementPage() {
		console.log("page incremented");
		this.setState({ page: this.state.page + 1 });
	}

	trackScrolling = () => {
		if (this.isTop()) {
			this.incrementPage();
			getChatHistory(
				this.context.accessToken,
				this.props.colabId,
				this.state.page
			).then((data) => {
				console.log(data);
				this.concatOldMessages(data);
			});
			document
				.getElementById("chatBox")
				.removeEventListener("scroll", this.trackScrolling);
		}
	};

	concatOldMessages(messages) {
		if (messages.length > 0) {
			var chatArr = messages;
			chatArr.reverse();
			chatArr = chatArr.concat(this.state.chatHistory);
			this.setState({ chatHistory: chatArr });
		}
	}

	updateChatHistory(data) {
		this.setState({ chatHistory: this.state.chatHistory.concat(data) });
		this.scrollToBottom();
	}

	sendMessage = (event) => {
		event.preventDefault();
		if (this.state.message) {
			let message = {
				sender: this.context.user._id,
				body: this.state.message,
				collaboration: this.props.colabId,
				sender_username: this.state.username,
				sender_avatar: this.context.user.avatar,
			};

			socket.emit("chatRoom_MSG", message);
			this.setState({ message: "" });
			sendChatMessage(this.context.accessToken, this.props.colabId, {
				message: message.body,
			}).then((data) => {});
		}
	};
	handleChange = (input) => (e) => {
		this.setState({ [input]: e.target.value });
	};

	toggleChat = () => {
		this.props.toggleChat();
	};
	scrollToBottom = () => {
		this.boxRef.current.scrollTop = this.boxRef.current.scrollHeight;
	};

	componentDidUpdate = () => {
		// this.scrollToBottom();
		document
			.getElementById("chatBox")
			.addEventListener("scroll", this.trackScrolling);
	};

	render() {
		return (
			<div className="outerContainer">
				<div id="containerr">
					<div className="infoBar">
						<div className="leftInnerContainer">
							<img className="onlineIcon" src={onlineIcon} alt="online icon" />
							<h5>{this.props.colab_name}</h5>
						</div>
						<div className="rightInnerContainer">
							<button onClick={() => this.toggleChat()}>
								<img src={closeIcon} alt="close icon" />
							</button>
						</div>
					</div>
					<div
						id="chatBox"
						ref={this.boxRef}
						style={{
							overflowY: "scroll",
							height: "400px",
							paddingBottom: "10px",
						}}>
						{this.state.chatHistory.map((message, i) => (
							<div key={i} style={{ margin: "10px" }}>
								<Message message={message} user_id={this.context.user._id} />
							</div>
						))}
					</div>
					<form className="chatForm">
						<input
							className="input"
							type="text"
							placeholder="Type a message..."
							value={this.state.message}
							onChange={this.handleChange("message")}
							onKeyPress={(event) =>
								event.key === "Enter" ? this.sendMessage(event) : null
							}
						/>
						<button className="sendButton" onClick={(e) => this.sendMessage(e)}>
							Send
						</button>
					</form>
				</div>
			</div>
		);
	}
}
export default ChatRoom;
