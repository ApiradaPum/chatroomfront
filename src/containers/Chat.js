import React, {Component} from 'react';
import socketIOClient from 'socket.io-client';
import Messagesbox from "./Messagesbox";
import UserLogin from "./UserLogin";
import UserList from "./UserList";

class Chat extends Component {
	constructor() {
	  super()
  
	  	this.state = {
			colors: ['darksalmon', 'deepskyblue', 'darkgreen', 'cornflowerblue', 'brown', 'coral', 'blueviolet','red', 'blue'],
			input: '',
			username: '',
			messageArea: 'hideBlock',
			userArea: 'showBlock',
			users:[],
			messages: [],
			socket: socketIOClient("https://chatroombackbymmitnn.herokuapp.com/")
	  	}
	}

	sendMessage = (message) =>{
		if(this.state.username === "" || message === ""){
			return;
		}
		
		const { socket, username } = this.state
		socket.emit('sent-message', {username, message})

	}

	
  
	componentDidMount = () => {
		this.response();
	}

	response = () => {
		const { socket, messages } = this.state;
		
		socket.on('get users', (data) => {
			this.setState({ users: data });
		});

		socket.on('user logout', (data) => {
			socket.emit('sent-message', {username: null, message: data+" was logout"});
		});

		socket.on('new-message', (messageNew) => {
			const temp = messages;
			temp.push(messageNew);
			this.setState({ messages: temp });
		});
	}


	usersend = (username) => {
		const { socket } = this.state

		if(username !== ""){
			socket.emit('new user', {username})
			socket.emit('sent-message', {username: null, message: username+" has login"});
			
			this.setState({username,  messageArea: 'showBlock', userArea: 'hideBlock' })
		}
	}

	
  
	render() {
		const { input, users, userArea, messageArea, messages} = this.state
		return (
			<div>
				<UserLogin userArea={userArea} onLogin={this.usersend} />
				<div id="messageArea" className={messageArea} >
					<UserList users={users} />
					<Messagesbox input={input} onSendMessage={this.sendMessage} users={users} messages={messages} />
				</div>
			</div>
				
			)
		}
	}
  
  
  export default Chat