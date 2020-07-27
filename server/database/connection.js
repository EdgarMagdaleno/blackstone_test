const mongoose = require('mongoose');
let connection = mongoose.connect('mongodb://127.0.0.1/BLACKSTONE_TEST', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Task = new Schema({
  owner: ObjectId,
  body: String,
  dueDate: Date,
  completed: Boolean
});
module.exports.Task = mongoose.model('Task', Task);

const User = new Schema({
	email: {
		type: String,
		unique: true
	},
	password: String,
	accessToken: {
		type: String,
		unique: true
	}
});
module.exports.User = mongoose.model('User', User);

module.exports.getConnection = async () => {
	if (connection == null) {
		connection = await mongoose.connect('mongodb://localhost/BLACKSTONE_TEST', {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
	}

	return connection;
}