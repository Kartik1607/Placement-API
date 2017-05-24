var express = require('express');
var bodyParser =  require('body-parser');
var mongoose = require('mongoose');
var validator = require('validator');
var errors = require('errors');
var winston = require('winston');
var app = express();
var cors = require('cors');


var HttpStatus = require('http-status-codes');
winston.add(winston.transports.File, { filename: 'LogFile.log' });


/* ERRORS CREATED BELOW */

errors.create({
	name: 'JsonParseException',
	defaultMessage: 'Invalid JSON String',
	defaultExplanation: 'The String is not valid JSON String',
	defaultResponse: 'Verify the String'
});

errors.create({
	name: 'JsonDataException',
	defaultMessage: 'JSON data does not meet minimum required conditions',
	defaultExplanation: 'JSON is missing some required key fields',
	defaultResponse: 'Verify that JSON contains all required keys'
});

errors.create({
	name: 'InvalidRollnoException',
	defaultMessage: 'RollNumber is not a positive integer',
	defaultExplanation: 'RollNumber of student must be a positive integer',
	defaultResponse: 'Verify that rollno is positive integer'
});

errors.create({
	name: 'InvalidCGPAException',
	defaultMessage: 'CGPA is not a positive float',
	defaultExplanation: 'CGPA of student must be a positive float between 0 and 10',
	defaultResponse: 'Verify that CGPA is positive float within boundry'
});

errors.create({
	name: 'InvalidDepartmentException',
	defaultMessage: 'Department is not valid',
	defaultExplanation: 'Department entered does not match any possible departments',
	defaultResponse: 'Allowed departments are ["CSE","IT","ME","CV","BBA","BCOM","EEE","ECE"]'
});

errors.create({
	name: 'InvalidIdException',
	defaultMessage: 'Id is not valid mongoId',
	defaultExplanation: 'Id is not correct mongoId',
	defaultResponse: 'Check Id specified'
});

errors.create({
	name: 'InvalidPlacementDateException',
	defaultMessage: 'Date is either invalid or has passed',
	defaultExplanation: 'Date format is wrong or is a past date',
	defaultResponse: 'Check date. Correct Format : mm-dd-yyyy'
});

department_array = ["CSE","IT","ME","CV","BBA","BCOM","EEE","ECE"]; //List of possible departments
Students = require('./models/student');
Companies = require('./models/company');
Registrations = require('./models/registration');

app.use(bodyParser.json())

mongoose.connect('mongodb://localhost/placement');
var db = mongoose.connection;

app.get('/', function(req,res){
	res.send('Placement API');
}); 

app.use(cors())
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
	if(id !== undefined){
		if(!validator.isMongoId(id + '')){
			res.status(HttpStatus.BAD_REQUEST).send( new errors.InvalidIdException().toString());
			return;
		}
		query._id= id;
	}
	if(name !== undefined)
		query.name = name;
	if(date !== undefined){
		query.placement_date = date;
	}
	Companies.getCompanies(query, function(err,companies){
		if(err){
			winston.log('error',"Get (Companies) : " + err);
			throw err;
		}
		winston.log('info',companies);
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
	if(id !== undefined){
		if(!validator.isMongoId(id + '')){
			res.status(HttpStatus.BAD_REQUEST).send( new errors.InvalidIdException().toString());
			return;
		} 
		query._id= id;
	}
	if(name !== undefined){
		query.name = name;
	}
	if(department !== undefined){
		if(!validator.isIn(department,department_array)){
			res.status(HttpStatus.BAD_REQUEST).send( new errors.InvalidDepartmentException().toString());
			return;
		}
		query.department = department;
	}
	if(mincgpa !== undefined){
		if(!validator.isFloat(cgpa + '',{min : 0.0 , max : 10.0})){
			res.status(HttpStatus.BAD_REQUEST).send( new errors.InvalidCGPAException().toString());
			return;
		}
		query.cgpa = { $gte: mincgpa };
	}
	Students.getStudents(query, function(err,students){
		if(err){
			winston.log('error',"Get (Students) : " + err);
			throw err;
		}
		winston.log('info',students);
		res.json(students);
	});
});



/* 
Gets registration list based on query parameters. 

		__SCHEMA__
student_Id : _id for student,
company_Id : _id for company,
*/
app.get('/api/students/register', function(req,res){
	sid = req.query.sid;
	cid = req.query.cid;
	var query = {};
	if(sid !== undefined){
		if(!validator.isMongoId(sid + '')){
			res.status(HttpStatus.BAD_REQUEST).send( new errors.InvalidIdException().toString());
			return;
		}
		query.student_Id = sid;
	}
	if(cid !== undefined){
		if(!validator.isMongoId(cid + '')){
			res.status(HttpStatus.BAD_REQUEST).send( new errors.InvalidIdException().toString());
			return;
		}
		query.company_Id = cid;
	}
	Registrations.getRegistrations(query,function(err,registration){
		if(err){
			winston.log('error',"Get (Students Register) : " + err);
			throw err;
		}
		winston.log('info',registration);
		res.json(registration);
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
	*/
app.post('/api/students/add', function(req, res){
	var student = req.body;
	
	if(student.hasOwnProperty("name")  
		&& student.hasOwnProperty("department")
		&& student.hasOwnProperty("rollno")
		&& student.hasOwnProperty("cgpa")){

		if(!validator.isIn(student.department.toUpperCase(), department_array)){
			res.status(HttpStatus.BAD_REQUEST).send( new errors.InvalidDepartmentException().toString());
			return;
		}

		if(!validator.isInt(student.rollno + '', { gt : 0})){
			res.status(HttpStatus.BAD_REQUEST).send( new errors.InvalidRollnoException().toString());
			return;
		}	

		if(!validator.isFloat(student.cgpa + '', {min : 0.0 , max : 10.0})){
			res.status(HttpStatus.BAD_REQUEST).send( new errors.InvalidCGPAException().toString());
			return;
		}

		Students.addStudent(student, function(err, student){
			if(err){
				winston.log('error',"Post (Students Add) : " + err);
				throw err;
			}
			winston.log('info',student);
			res.json(student);
		});
	}else{
		res.status(HttpStatus.BAD_REQUEST).send( new errors.JsonDataException().toString());
	}
});



/*
Updates student/s based on query.
Usage : POST JSON object for updates needed.
	Optional Query Search Parameters
id : _id for student
name : Name of student (Full name) (Case Sensitive)
department : All students of given department
mincgpa : All students with CPGA >= provided.
*/
app.post('/api/students/update', function(req, res){
	var student = req.body;
	id = req.query.id;
	name = req.query.name;
	department = req.query.department;
	mincgpa = req.query.mincgpa;
	var query = {};
	if(id !== undefined){
		if(validator.isMongoId(id + ''))
			query._id= id;
		else{
			res.status(HttpStatus.BAD_REQUEST).send( new errors.InvalidIdException().toString());
			return;
		}
	} 
	if(name !== undefined){
		query.name = name;
	}
	if(department !== undefined){
		if(validator.isIn(department.toUpperCase(), department_array))
			query.department = department;
		else{
			res.status(HttpStatus.BAD_REQUEST).send( new errors.InvalidDepartmentException().toString());
			return;
		}
	}
	if(mincgpa !== undefined){
		if(validator.isFloat(mincgpa + '', {min : 0.0 , max : 10.0}))
			query.cgpa = { $gte: mincgpa };
		else{
			res.status(HttpStatus.BAD_REQUEST).send( new errors.InvalidCGPAException().toString());
			return;
		}
	}

	if( student.hasOwnProperty("rollno") && !validator.isInt(student.rollno + '', { gt : 0})){
		res.status(HttpStatus.BAD_REQUEST).send( new errors.InvalidRollnoException().toString());
		return;
	}

	if( student.hasOwnProperty("department") && !validator.isIn(student.department.toUpperCase(), department_array)){
		res.status(HttpStatus.BAD_REQUEST).send( new errors.InvalidDepartmentException().toString());
		return;
	}

	if( student.hasOwnProperty("cgpa") && !validator.isFloat(student.cgpa + '', {min : 0.0 , max : 10.0})){
		res.status(HttpStatus.BAD_REQUEST).send( new errors.InvalidCGPAException().toString());
		return;
	}

	Students.updateStudents(query, student, function(err, student){
		if(err){
			winston.log('error',"Post (Students update) : " + err);
			throw err;
		}
		winston.log('info',student);
		res.json(student);
	});
});


/*
Regiters a student for a company
Usage : Send query parameters.
Returns JSON string of created object if not exists. 
	Required Query Search Parameters
sid : _id for student
cid : _id for company
*/
app.post('/api/students/register', function(req,res){
	sid = req.query.sid;
	cid = req.query.cid;
	if(!(validator.isMongoId(cid + '') && validator.isMongoId(sid + ''))){
		res.status(HttpStatus.BAD_REQUEST).send( new errors.InvalidIdException().toString());
		return;
	}
	var register = {};
	if(cid !== undefined && sid !== undefined){
		register.student_Id = sid;
		register.company_Id = cid;
		Registrations.addRegistration(register,function(err, register){
			if(err){
				winston.log('error',"Post (Students Register) : " + err);
				throw err;
			}
			winston.log('info',register);
			res.json(register);
		})
	}else{
		res.send("Invalid Query Parameters");
	}
});


/*
Registers a new company to companys collecton.
Usage : POST a JSON object. 
content-type:application/json
Returns JSON string of created object.

			__SCHEMA__
	name : String, //Name of Company
	placement_date : String, //Date when company is coming for placemnt
	*/
app.post('/api/companies/register', function(req, res){
	var company = req.body;
	console.log(company);
	if(company.hasOwnProperty("name") && company.hasOwnProperty("placement_date")){
		if(!validator.isAfter(company.placement_date)){
			res.status(HttpStatus.BAD_REQUEST).send( new errors.InvalidPlacementDateException().toString());
			return;
		}
		Companies.registerCompany(company, function(err, company){
			if(err){
				winston.log('error',"Post (Companies Register) : "+err);
				throw err;
			}
			winston.log('info',company);
			res.json(company);
		});
	}else{
		res.status(HttpStatus.BAD_REQUEST).send( new errors.JsonDataException().toString());
	}
});
















	/* Delete Methods Below */




/*
Unregisters a student from placement base on query

Required query paramter : sid (Student Id)
Optional query paramert : cid (Compant Id)

*/
app.delete('/api/students/register', function(req, res){
	sid = req.query.sid;
	cid = req.query.cid;
	var query = {};
	if(cid !== undefined){
		if(!validator.isMongoId(cid + '')){
			res.send( new errors.InvalidIdException().toString());
			return;
		}
		query.company_Id = cid;
	}
	if(sid !== undefined){
		if(!validator.isMongoId(sid + '')){
			res.send( new errors.InvalidIdException().toString());
			return;
		}
		query.student_Id = sid;
	}
	if(sid === undefined){
		res.send("Invalid Query Parameters");
	}
	else{
		Registrations.removeRegistration(query,function(err, register){
			if(err){
				winston.log('error',"Delete (Students Register) : " + err);
				throw err;
			}
			winston.log('info',register);
			res.json(register);
		});
	}
});



/*
Unregisters a company from placement.

Required query parameter : cid (Company Id)
*/
app.delete('/api/companies/register', function(req,res){
	cid = req.query.cid;
	var query = {};
	
	if(cid !== undefined){
		if(!validator.isMongoId(cid + '')){
			res.send( new errors.InvalidIdException().toString());
			return;
		}
		query.company_Id = cid;
	}

	if(cid === undefined){
		res.send("Invalid Query Parameters");
	}
	else{
		queryC = {};
		queryC._id = cid;
		Companies.removeCompany(queryC,function(err, company){
			if(err){
				winston.log('error', "Delete (Companies Register) : " + err);
				throw err;
			}
			Registrations.removeRegistration(query,function(err, register){
				if(err){
					winston.log('error', "Delete (Companies Register) : " + err);
					throw err;
				}
				winston.log('info',register);
				winston.log('info',company);
				res.json(register + " " + company);
			}); 
		});
		

	}
});


app.delete('/api/students/remove', function(req,res){
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

	Students.removeStudents(query,function(err, student){
		if(err){
			winston.log('error', "Delete (Students Remove) : " + err);
			throw err;
		}
		winston.log('info',student);
		res.json(student);
	});
});