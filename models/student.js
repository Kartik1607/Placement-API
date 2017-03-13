var mongoose = require('mongoose');

var studentSchema = mongoose.Schema({
	name : String, //Name of Student
	department : String, //Departemnt of Student. eg CSE, IT etc
	rollno : Number, //Rollnumber of Student
	cgpa : Number, //CGPA of Student
	applied_For : [mongoose.Schema.Types.ObjectId], // Array of ObjectId for companies
	updated : { type: Date, default: Date.now },
}); 

/*
Creates students collection.(Monogoose plurarizes the collection name)
Use db.students.find() to find all entries in mongo 
*/
var Students = module.exports = mongoose.model('Student', studentSchema);


/* 
Saves Student in students collection
*/
module.exports.addStudent = function(student, callback){
	Students.create(student, callback);
}