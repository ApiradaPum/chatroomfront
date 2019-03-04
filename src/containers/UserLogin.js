import React, {Component} from 'react';

class UserLogin extends Component{
    state = {
        username:'',
    }
    
	onNameKeyPress = (e) => {
		if(e.key === 'Enter'){
			this.onLogin()
		}
	}

    onInputName = (e) => {
		this.setState({ username: e.target.value })
    }
    
    onLogin(){
        this.props.onLogin(this.state.username);
        this.setState({username: ''});
    }

    render(){
        const { userArea } = this.props;
        return (
            <div id="userArea" className={userArea}>
                <h3 className="chat-title">Welcome To Chat Room</h3>
                <div className="padding-t-20">
                    <span>Name : </span> 
                    <input className="inputName" value={this.state.username} onChange={this.onInputName} onKeyPress={this.onNameKeyPress} placeholder="Please enter your name"/>
                    <button className="name-send" onClick={() => this.onLogin()} >Send</button>
                </div>
            </div>
        );
    }
};
  
export default UserLogin;
  