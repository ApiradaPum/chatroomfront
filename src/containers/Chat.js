import React, {Component} from 'react';
import socketIOClient from 'socket.io-client';

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
			message: [],
			socket: socketIOClient("https://chatroombackbymmitnn.herokuapp.com/")
	  	}
	}

	renderMessages = () =>{
		const { colors, users } = this.state;
		console.log(this.state.message);
		return this.state.message.map((data,i) => {
			if(data.user === null){
				return (
					<div key={i} className="text-cen"  >
						 {data.message}
					  </div>
				);
			}
			return (
				<div key={i}  >
					<span style={{color:colors[users.indexOf(data.user)%9]}}>{data.user}</span> : {data.message}
				</div>
			);
		});
	}

	renderUsers = () =>{
		const { colors } = this.state
		return this.state.users.map((data,i) => {
			return (
				<li key={i} style={{color:colors[i%9]}}>{data}</li>
			);
		});
	}

	sendMessage = () =>{
		if(this.state.username === "" || this.state.input === ""){
			return;
		}
		
		const { socket, input, username } = this.state
		socket.emit('sent-message', {username, input})
		this.setState({ input: '' })

		window.setInterval(function() {
			var elem = document.getElementById('data');
			elem.scrollTop = elem.scrollHeight;
		}, 1000);
	}

	handleKeyPress = (e) => {
		if(e.key === 'Enter'){
			this.sendMessage()
		}
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
		const { socket, message } = this.state;
		
		socket.on('get users', (data) => {
			this.setState({ users: data });
		});

		socket.on('user logout', (data) => {
			socket.emit('sent-message', {username: null, input: data+" was logout"});
		});

		socket.on('new-message', (messageNew) => {
			const temp = message;
			temp.push(messageNew);
			this.setState({ message: temp });
		});

		
	}
  
	send = (message) => {
	  this.sendMessage()
	}

	usersend = () => {
		const { socket, username } = this.state

		if(username !== ""){
			socket.emit('new user', {username})
			socket.emit('sent-message', {username: null, input: username+" has login"});
			
			this.setState({username,  messageArea: 'showBlock', userArea: 'hideBlock' })
		}
	}
  
	changeInput = (e) => {
		this.setState({ input: e.target.value })
	}

	changeName = (e) => {
		this.setState({ username: e.target.value })
	}
  
	render() {
	  	const { input,username } = this.state
		return (
			<div>
				<div id="userArea" className={this.state.userArea}>
					<h3 className="chat-title">Welcome To Chat Room</h3>
					<div className="padding-t-20">
						<span>Name : </span> 
						<input className="inputName" value={username} onChange={this.changeName} onKeyPress={this.nameKeyPress} placeholder="Please enter your name"/>
						<button className="name-send" onClick={() => this.usersend()} >Send</button>
					</div>
				</div>
				<div id="messageArea" className={this.state.messageArea} >
					<div className="box-left">
							<h2>Online Users</h2>
							<ul className="list-group" id="users">
								{
								this.renderUsers()
								}
							</ul>
					</div>
					<div className="box-right">
						
						<h3 className="chat-title">Welcome To Chat Room</h3>
						<div className="chat-list" id="data">
							{
							this.renderMessages()
							}
						</div>
						<div >
							<input className="chat-input" value={input} onChange={this.changeInput} onKeyPress={this.handleKeyPress}/>
							<button className="chat-send" onClick={() => this.send()} >Send</button>
						</div>
					</div>
				</div>
			</div>
				
			)
		}
	}
  
  
  export default Chat