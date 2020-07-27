import React, { Component } from 'react';
import { connect } from 'react-redux';
import Globals from '../Globals';

class Note extends Component {
    constructor(props) {
        super(props);

        this.completeTask = this.completeTask.bind(this);
    }

    completeTask() {
        let body = {
            taskId: this.props.taskId
        };

        fetch(Globals.API_URL + 'toggleTaskCompletion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            credentials: 'include'
        }).then((response) => {
            return response.json();
        }).then((data) => {
            this.props.dispatch({
                type: 'TOGGLE_TASK_COMPLETION',
                taskId: body.taskId
            });
        }).catch((err) => {
            console.log("err", err);
        });
    }

    render() {
        let noteClass = "note";
        if (this.props.completed) {
            noteClass += " completed"
        }

        let dueDate = new Intl.DateTimeFormat('en-US').format(this.props.dueDate);
        return (
        	<div className={noteClass}>
                <div className="note-title">
                    <p>{dueDate}</p>
                    <button className="green button" onClick={this.completeTask}><i className="material-icons">check</i></button>
                </div>
                <div className="note-body-container">
                    <textarea className="note-body" value={this.props.body} disabled></textarea>
                </div>
            </div>
        );
    }
}

export default connect(null, null)(Note);