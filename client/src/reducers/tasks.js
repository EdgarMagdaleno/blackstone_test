const tasks = (state = [], action) => {
	switch (action.type) {
		case 'NEW_TASK':
			return [
				...state,
				action.newTask
			];
		case 'SYNC_TASKS':
			return [...action.tasks];
		case 'TOGGLE_TASK_COMPLETION':
			let taskIndex = state.findIndex(task => task._id === action.taskId);
			if (taskIndex >= 0) {
				state[taskIndex].completed = !state[taskIndex].completed;
			}

			return [...state];
		default:
			return state;
	}
}

export default tasks;