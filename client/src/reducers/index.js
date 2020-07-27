import { combineReducers } from 'redux'
import sessions from './sessions'
import tasks from './tasks'

export default combineReducers({
	sessions,
	tasks
})