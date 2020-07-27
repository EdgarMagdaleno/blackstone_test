import React, { Component } from 'react';
import { connect } from 'react-redux';
import Note from './Note';

class TaskGrid extends Component {
    render() {
        return (
        	<div className="task-grid-container">
        	{this.props.tasks.map(task =>
            	<Note key={task._id} taskId={task._id} completed={task.completed} body={task.body} dueDate={new Date(task.dueDate)} />
          	)}
        	</div>
        );
    }
}

export default connect(null, null)(TaskGrid);