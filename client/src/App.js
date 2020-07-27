import React, { Component } from 'react';
import { connect } from 'react-redux';
import Login from './components/Login';
import Home from './components/Home';
import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";

import Cookies from 'universal-cookie';
const cookies = new Cookies();

class App extends Component {
	componentDidMount() {
		let currentAccessToken = cookies.get("accessToken");
		this.props.dispatch({
			type: 'SIGN_IN',
			accessToken: currentAccessToken
		});
	}

	render() {
		return (
		  <Router>
			<Switch>
			  <Route exact path='/' render={() => (
				this.props.accessToken ? (
					<Home />
				) : (
					<Login />
				)
			  )} />
			</Switch>
		  </Router>
		);
	}
}

function mapStateToProps(state) {
    return {
        accessToken: state.sessions.accessToken
    };
}

export default connect(mapStateToProps)(App);
