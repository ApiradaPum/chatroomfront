import React, {Component} from 'react';
import colors from '../json/colors.json';

class Messagesbox extends Component{
    state = {
        input:'',
        colors: colors.default
    }

    renderMessages = () =>{
        const { users, messages } = this.props;
        const { colors } = this.state;
		return messages.map((data,i) => {
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

    onKeyPress = (e) => {
		if(e.key === 'Enter'){
			this.send();
        }
    }
    
    onInputChange = (e) => {
		this.setState({ input: e.target.value })
    }
    
    send = () => {
        console.log(this.state.input);
        this.props.onSendMessage(this.state.input);

        this.setState({input: ''});
    }

    componentDidUpdate(){
        const elem = document.getElementById('data');
        elem.scrollTop = elem.scrollHeight;
    }

    render(){
        return (
            <div className="box-right">
                <h3 className="chat-title">Welcome To Chat Room</h3>
                <div className="chat-list" id="data">
                    {
                    this.renderMessages()
                    }
                </div>
                <div >
                    <input className="chat-input" value={this.state.input} onChange={this.onInputChange} onKeyPress={this.onKeyPress}/>
                    <button className="chat-send" onClick={() => this.send()} >Send</button>
                </div>
            </div>
        );
    }
};
  
export default Messagesbox;
  