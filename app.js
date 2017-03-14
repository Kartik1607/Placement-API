var express = require('express');
var app = express();
var bodyParser =  require('body-parser');
var mongoose = require('mongoose');
Students = require('./models/student');
Companies = require('./models/company');

app.use(bodyParser.json())

mongoose.connect('mongodb://localhost/placement');
var db = mongoose.connection;

app.get('/', function(req,res){
	res.send('Hello World');
}); 

app.listen(3456);

/* GET METHODS BELOW */

/*
Gets list of all the companies currently registered.
Usage : GET at /api/companies
Returns JSON string of all companies registered.

Optional Query Search Parameters
id : _id for Company
name : Name of Company (Case sensitive)
date : Placement date of company
*/
app.get('/api/companies', function(req,res){
	id = req.query.id;
	name = req.query.name;
	date = req.query.date;
	var query = {};
	if(id !== undefined) 
		query._id= id;
	if(name !== undefined)
		query.name = name;
	if(date !== undefined)
		query.placement_date = date;
	Companies.getCompanies(query, function(err,companies){
		if(err){
			throw err;
		}
		res.json(companies);
	});
});

/*
Gets list of all the students currently saved.
Usage : GET at /api/students
Returns JSON string of all students saved.

Optional Query Search Parameters
id : _id for student
name : Name of student (Full name) (Case Sensitive)
department : All students of given department
mincgpa : All students with CPGA >= provided.
*/
app.get('/api/students', function(req,res){
	id = req.query.id;
	name = req.query.name;
	department = req.query.department;
	mincgpa = req.query.mincgpa;
	var query = {};
	if(id !== undefined) 
		query._id= id;
	if(name !== undefined)
		query.name = name;
	if(department !== undefined)
		query.department = department;
	if(mincgpa !== undefined)
		query.cgpa = { $gte: mincgpa };
	Students.getStudents(query, function(err,students){
		if(err){
			throw err;
		}
		res.json(students);
	});
});















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
app.post('/api/companies', function(req, res){
	var company = req.body;
	Companies.registerCompany(company, function(err, company){
		if(err){
			throw err;
		}
		res.json(company);
	});
});