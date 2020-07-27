import React from 'react';
import Globals from '../Globals';
import { connect } from 'react-redux';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';

class Login extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: '',
			confirmPassword: '',
			showRegister: false
		};

		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
		this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
		this.toggleRegisterForm = this.toggleRegisterForm.bind(this);
	}

	toggleRegisterForm() {
		this.setState(prevState => {
			return {
				showRegister: !prevState.showRegister
			}
		});
	}

	handleLoginSubmit(e) {
		e.preventDefault();

		let form = {
			email: this.state.email,
			password: this.state.password
		};

		let endpointName = 'login';
		if (this.state.showRegister) {
			endpointName = 'register';
			form.confirmPassword = this.state.confirmPassword;

			if (form.password !== form.confirmPassword) {
				store.addNotification({
				  title: "Error",
				  message: "Passwords must be equal",
				  type: "danger",
				  insert: "top",
				  container: "top-right",
				  animationIn: ["animated", "fadeIn"],
				  animationOut: ["animated", "fadeOut"]
				});

				return;
			}
		}

		fetch(Globals.API_URL + endpointName, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(form),
			credentials: 'include'
		}).then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				store.addNotification({
				  title: "Error",
				  message: "Invalid credentials",
				  type: "danger",
				  insert: "top",
				  container: "top-right",
				  animationIn: ["animated", "fadeIn"],
				  animationOut: ["animated", "fadeOut"]
				});

				throw new Error('Invalid credentials');
			}
		}).then((data) => {
			if (data.accessToken) {
				this.props.dispatch({
					type: 'SIGN_IN',
					accessToken: data.accessToken
				});
			}
		}).catch((err) => {
			console.log(err);
		});
	}

	handleEmailChange(e) {
		this.setState({
			email: e.target.value
		});
	}

	handlePasswordChange(e) {
		this.setState({
			password: e.target.value
		});
	}

		handleConfirmPasswordChange(e) {
		this.setState({
			confirmPassword: e.target.value
		});
	}


	render() {

		return (
			<div className="login-container">
				<ReactNotification />
				<div className="login-form-container">
					<h1>{ this.state.showRegister ? 'Register' : 'Login' }</h1>
					<input className="login-text" type="text" name="email" placeholder="Email" onChange={this.handleEmailChange} required />
					<input className="login-text" type="password" name="password" placeholder="Password" onChange={this.handlePasswordChange} required />
					{ this.state.showRegister ? (
						<input className="login-text" type="password" name="confirmPassword" placeholder="Confirm password" onChange={this.handleConfirmPasswordChange} required />
					) : null }
					<button className="green button" type="submit" onClick={this.handleLoginSubmit}><i className="material-icons">login</i></button>
					<button className="green button" type="submit" onClick={this.toggleRegisterForm}>{ !this.state.showRegister ? 'Register' : 'Login' }</button>
				</div>
			</div>
		);
	}
}

export default connect(null, null)(Login);
