var express = require('express');
var app = express();
var bodyParser =  require('body-parser');
var mongoose = require('mongoose');
Students = require('./models/student');
Companys = require('./models/company');

app.use(bodyParser.json())

mongoose.connect('mongodb://localhost/placement');
var db = mongoose.connection;

app.get('/', function(req,res){
	res.send('Hello World');
}); 

app.listen(3456);


/* POST METHODS BELOW*/

/*
Adds a new student to students collecton.
Usage : POST a JSON object. 
content-type:application/json
Returns JSON string of created object.

			__SCHEMA__
	name : String, //Name of Student
	department : String, //Departemnt of Student. eg CSE, IT etc
	rollno : Number, //Rollnumber of Student
	cgpa : Number, //CGPA of Student
	applied_For : [mongoose.Schema.Types.ObjectId], // Array of ObjectId for companies
*/
app.post('/api/students', function(req, res){
	var student = req.body;
	Students.addStudent(student, function(err, student){
		if(err){
			throw err;
		}
		res.json(student);
	});
});


/*
Registers a new company to companys collecton.
Usage : POST a JSON object. 
content-type:application/json
Returns JSON string of created object.

			__SCHEMA__
	name : String, //Name of Company
	placement_date : String, //Date when company is coming for placemnt
	student_Ids : [mongoose.Schema.Types.ObjectId], // Array of ObjectId for Students who have applied to this company

*/
app.post('/api/companys', function(req, res){
	var company = req.body;
	Companys.registerCompany(company, function(err, company){
		if(err){
			throw err;
		}
		res.json(company);
	});
});