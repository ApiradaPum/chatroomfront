import React, {Component} from 'react';
import socketIOClient from 'socket.io-client';
import Messagesbox from "./Messagesbox";

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
			socket: socketIOClient("http://localhost:5000")
	  	}
	}

	sendMessage = (message) =>{
		if(this.state.username === "" || message === ""){
			return;
		}
		
		const { socket, username } = this.state
		socket.emit('sent-message', {username, message})

	}

	renderUsers = () =>{
		const { colors } = this.state
		return this.state.users.map((data,i) => {
			return (
				<li key={i} style={{color:colors[i%9]}}>{data}</li>
			);
		});
	}
	

	nameKeyPress = (e) => {
		if(e.key === 'Enter'){
			this.usersend()
		}
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


	usersend = () => {
		const { socket, username } = this.state

		if(username !== ""){
			socket.emit('new user', {username})
			socket.emit('sent-message', {username: null, message: username+" has login"});
			
			this.setState({username,  messageArea: 'showBlock', userArea: 'hideBlock' })
		}
	}
  
	

	changeName = (e) => {
		this.setState({ username: e.target.value })
	}
  
	render() {
		const { input,username, users, userArea, messageArea, messages} = this.state
		return (
			<div>
				<div id="userArea" className={userArea}>
					<h3 className="chat-title">Welcome To Chat Room</h3>
					<div className="padding-t-20">
						<span>Name : </span> 
						<input className="inputName" value={username} onChange={this.changeName} onKeyPress={this.nameKeyPress} placeholder="Please enter your name"/>
						<button className="name-send" onClick={() => this.usersend()} >Send</button>
					</div>
				</div>
				<div id="messageArea" className={messageArea} >
					<div className="box-left">
							<h2>Online Users</h2>
							<ul className="list-group" id="users">
								{
								this.renderUsers()
								}
							</ul>
					</div>
					<Messagesbox input={input} onSendMessage={this.sendMessage} users={users} messages={messages} />
				</div>
			</div>
				
			)
		}
	}
  
  
  export default Chat