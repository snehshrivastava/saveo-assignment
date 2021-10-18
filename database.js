var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://user007:alwaysme@cluster0.itp2v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{useNewUrlParser: true});
var conn = mongoose.connection;
conn.on('connected',function () {
	console.log('db connceted successdully');
});
conn.on('disconnected',function () {
	console.log('db is disconnected');
});

conn.on('error',console.error.bind(console,'connection error:'));
module.export = conn;
