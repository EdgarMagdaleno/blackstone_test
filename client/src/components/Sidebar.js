import React, { Component } from 'react';
import { connect } from 'react-redux';
import Calendar from 'react-calendar';
import Globals from '../Globals';
import { store } from 'react-notifications-component';

const initialState = {
    showCalendar: false,
    newTaskForm: {
        body: '',
        dueDate: new Date()
    }
};

class Sidebar extends Component {
	constructor(props) {
		super(props);

        this.state = initialState;

        this.toggleCalendar = this.toggleCalendar.bind(this);
        this.postNewTask = this.postNewTask.bind(this);
        this.onChangeCalendar = this.onChangeCalendar.bind(this);
        this.onChangeBody = this.onChangeBody.bind(this);
	}

    toggleCalendar() {
        let state = this.state.showCalendar;
        this.setState({
            showCalendar: !state
        });
    }

    onChangeCalendar = (date) => {
        this.toggleCalendar();
        this.setState(prevState => ({
            newTaskForm: {
                ...prevState.newTaskForm,
                dueDate: date
            }
        }))
    };

    onChangeBody({ target }) {
        this.setState(prevState => ({
            newTaskForm: {
                ...prevState.newTaskForm,
                body: target.value
            }
        }));
    }

    postNewTask() {
        fetch(Globals.API_URL + 'tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.newTaskForm),
            credentials: 'include'
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }

            store.addNotification({
              title: "Error",
              message: "Session expired",
              type: "danger",
              insert: "top",
              container: "top-right",
              animationIn: ["animated", "fadeIn"],
              animationOut: ["animated", "fadeOut"]
            });

            setTimeout(() => {
                this.props.dispatch({
                    type: 'SIGN_OUT'
                });
            }, 2000);

            throw new Error('Session expired');
        }).then((data) => {
            this.props.dispatch({
                type: 'NEW_TASK',
                newTask: data
            });
        }).catch((err) => {
            console.log("err", err);
        });

        this.setState(initialState);
    }

    render() {
        let dueDate = new Intl.DateTimeFormat('en-US').format(this.state.newTaskForm.dueDate);

        return (
        	<div className="sidebar-container">
            	<div className="note">
                    <div className="note-title">
                        <button className="green button" onClick={this.toggleCalendar}>
                            <i className="material-icons">calendar_today</i>
                        </button>
                        { this.state.showCalendar ? (
                            <div className="calendar-container">
                                <Calendar onChange={this.onChangeCalendar} value={this.state.newTaskForm.date} />
                            </div>
                        ) : (
                            <p>{dueDate}</p>
                        ) }
                        <button className="green button" onClick={this.postNewTask}><i className="material-icons">check</i></button>
                    </div>
                    <div className="note-body-container">
                        <textarea className="note-body" value={this.state.newTaskForm.body} onChange={this.onChangeBody} />
                    </div>
                </div>
        	</div>
        );
    }
}

export default connect(null, null)(Sidebar);