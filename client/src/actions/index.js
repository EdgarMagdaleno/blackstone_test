export const ADD_TASK = 'ADD_TASK';
export const TOGGLE_TASK = 'TOGGLE_TASK';

export const function addTask(text, due) {
	return { type: ADD_TASK, text: text, due: due }
}

export const function toggleTaskCompletion() {
	return { type: TOGGLE_TASK };
}