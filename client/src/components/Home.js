import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import Sidebar from './Sidebar'
import TaskGrid from './TaskGrid'
import Globals from '../Globals'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
const cookies = new Cookies();

class Home extends Component {
	constructor(props) {
		super(props);

		this.logOut = this.logOut.bind(this);
	}

	componentDidMount() {
		fetch(Globals.API_URL + 'getTasks', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}).then((response) => {
			return response.json();
		}).then((data) => {
			if (data.statusCode === 401) {
				cookies.remove('accessToken');
				return this.props.dispatch({
					type: 'SIGN_OUT'
				});
			}

			this.props.dispatch({
				type: 'SYNC_TASKS',
				tasks: data.tasks
			});
		}).catch((err) => {
			console.log("err", err);
		});
	}

	logOut() {
		this.props.dispatch({ type: 'SIGN_OUT' });
		cookies.remove("accessToken");
	}

    render() {
        return (
        	<>
        	<ReactNotification />
        	<div className="home-container">
        		<Sidebar></Sidebar>
        		<TaskGrid tasks={this.props.tasks}></TaskGrid>
        	</div>
        	</>
        );
    }
}

function mapStateToProps(state) {
    return {
        tasks: state.tasks
    };
}

export default connect(mapStateToProps, null)(Home);