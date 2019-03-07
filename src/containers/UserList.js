import React, {Component} from 'react';
import colors from '../json/colors.json';

class UserList extends Component{
    state = {
        colors: colors.default
    }

    renderUsers = () =>{
		const { colors } = this.state
		return this.props.users.map((data,i) => {
			return (
				<li key={i} style={{color:colors[i%9]}}>{data}</li>
			);
		});
	}
    
    render(){
        return (
            <div className="box-left">
                <h2>Online Users</h2>
                <ul className="list-group" id="users">
                    {
                    this.renderUsers()
                    }
                </ul>
            </div>
        );
    }
};
  
export default UserList;
  