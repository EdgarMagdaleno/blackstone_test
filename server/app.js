const port = 80;
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser')
const path = require('path');
const corsOptions = {
    origin: [`http://localhost:${port}`, 'http://localhost:3000'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.urlencoded({
	extended: false
}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.use('/api', require('./routes/api'));
app.use('/', (req, res, next) => {
	return res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(port, function () {
	console.log(`Server listening on port ${port}`);
});