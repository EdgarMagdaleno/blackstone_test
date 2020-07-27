const express = require('express');
const router = express.Router();
const db = require('../database/procedures');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

router.use(express.json())

router.post('/register', async function (req, res) {
	let newUser = {
		email: req.body.email,
		password: req.body.password
	};

	let err, accessToken;
	[err, accessToken] = await db.registerUser(newUser);
	if (err) return res.status(500).json(err);

	let expiration = new Date(Date.now());
	expiration.setMonth(expiration.getMonth() + 1);
	res.cookie('accessToken', accessToken, { expires: expiration, secure: false });
	return res.json({
		accessToken: accessToken
	});
});

router.post('/login', async function (req, res) {
	let err, accessToken;

	let email = req.body.email;
	let password = req.body.password;
	[err, accessToken] = await db.attemptLogin(email, password);
	if (err) return res.status(500).json(err);

	if (!accessToken) {
		return res.status(401).json({
			err: 'Invalid credentials',
			accessToken: null
		});
	}

	let expiration = new Date(Date.now());
	expiration.setMonth(expiration.getMonth() + 1);
	res.cookie('accessToken', accessToken, { expires: expiration, secure: false });
	return res.json({
		accessToken: accessToken
	});
});

router.post('/tasks', async function (req, res) {
	let err, task;

	[err, task] = await db.addNewTask(req.body, req.cookies.accessToken);
	if (err) return res.status(500).json(err);
	if (!task) return res.status(err.statusCode).json(err);

	return res.json(task);
});

router.post('/getTasks', async function (req, res) {
	let err, tasks;

	[err, tasks] = await db.getTasks(req.cookies.accessToken);
	if (err) return res.status(err.statusCode).json(err);

	return res.json({
		tasks: tasks
	});
});

router.post('/toggleTaskCompletion', async function (req, res) {
	let err, tasks;

	[err, tasks] = await db.toggleTaskCompletion(req.cookies.accessToken, req.body.taskId);
	if (err) return res.status(err.statusCode).json(err);

	return res.json(tasks);
});


module.exports = router;