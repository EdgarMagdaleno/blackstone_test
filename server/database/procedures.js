const { to } = require('await-to-js');
const db = require('./connection');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const saltRounds = 4;
const accessTokenSize = 32;

function generateAccessToken() {
	return crypto.randomBytes(accessTokenSize).toString('hex');
}

const INVALID_SESSION = {
	statusCode: 401
};

module.exports.registerUser = async (user) => {
	let err, out;
	
	let newUser = new db.User();
	newUser.email = user.email;
	newUser.password = bcrypt.hashSync(user.password, saltRounds);
	newUser.accessToken = generateAccessToken();

	[err, out] = await to(newUser.save());
	if (err) return [err, null];

	return [null, out.accessToken];
}

module.exports.attemptLogin = async (email, password) => {
	let err, out, user;

	[err, user] = await to(db.User.findOne({
		email: email
	}));
	if (err) return [err, null];
	if (!user) return [INVALID_SESSION, null];

	let valid = bcrypt.compareSync(password, user.password);
	if (!valid) {
		return [null, false];
	}

	user.accessToken = generateAccessToken();
	[err, out] = await to(user.save());
	if (err) return [err, false];


	return [null, user.accessToken];
}

module.exports.logOut = async (accessToken) => {
	let err, out;

	let newUser = new db.User();
	newUser.email = user.email;
	newUser.password = bcrypt.hashSync(user.password, saltRounds);

	[err, out] = await to(newUser.save());
	if (err) return [err, null];

	return [null, out];
}

module.exports.addNewTask = async (newTaskForm, accessToken) => {
	let err, user;

	[err, user] = await to(db.User.findOne({
		accessToken: accessToken
	}));
	if (err) return [err, null];
	if (!user) return [INVALID_SESSION, null];

	let newTask = new db.Task();
	newTask.body = newTaskForm.body;
	newTask.completed = false;
	newTask.owner = user._id;
	newTask.dueDate = newTaskForm.dueDate;

	let task;
	[err, task] = await to(newTask.save());
	if (err) return [err, null];

	return [null, newTask];
}

module.exports.getTasks = async (accessToken) => {
	let err, user;

	[err, user] = await to(db.User.findOne({
		accessToken: accessToken
	}));
	if (err) return [err, null];
	if (!user) return [INVALID_SESSION, null];

	let tasks;
	[err, tasks] = await to(db.Task.find({
		owner: user._id
	}));

	return [null, tasks];
}

module.exports.toggleTaskCompletion = async (accessToken, taskId) => {
	let err, task;

	[err, task] = await to(db.Task.findOne({
		_id: taskId
	}));
	if (err) return [err, null];

	let user;
	[err, user] = await to(db.User.findOne({
		_id: task.owner
	}));
	if (!user) return [INVALID_SESSION, null];

	task.completed = !task.completed;
	await task.save();

	return [null, task.completed];
}