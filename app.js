var express = require('express');
var app = express();
var bodyParser =  require('body-parser');
var mongoose = require('mongoose');
Students = require('./models/student');

mongoose.connect('mongodb://localhost/placement');
var db = mongoose.connection;

app.get('/', function(req,res){
	res.send('Hello World');
}); 

app.listen(3456);

app.post('/api/students', function(req, res){
	var student = req.body;
	Students.addStudent(student, function(err, student){
		if(err){
			throw err;
		}
		res.json(student);
	});
});