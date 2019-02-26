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
			endpoint: "https://chatroombackbymmitnn.herokuapp.com:8080"
	  }
	}

	renderMessages = () =>{
		const { colors, users } = this.state;
		return this.state.message.map((data,i) => {
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
		
		const { endpoint, input, username } = this.state
		const socket = socketIOClient(endpoint)
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
	  this.response()
	}
  
	send = (message) => {
	  this.sendMessage()
	}

	usersend = () => {
		const { endpoint, username, users } = this.state
		const socket = socketIOClient(endpoint)
		if(username !== ""){
			socket.emit('new user', {username})
			this.setState({ username: username })

			socket.on('get users', (data) => {
				this.setState({ users: data })
			})
	
			this.setState({  messageArea: 'showBlock', userArea: 'hideBlock' })
		}
	}
  
	response = () => {
	  	const { endpoint, message, users } = this.state
		const temp = message
		const tmpUser = users
		const socket = socketIOClient(endpoint)
		socket.on('new-message', (messageNew) => {
			temp.push(messageNew)
			this.setState({ message: temp })
		})
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