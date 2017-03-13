var mongoose = require('mongoose');

var studentSchema = mongoose.Schema({

	name : String, //Name of Student
	department : String, //Departemnt of Student. eg CSE, IT etc
	rollno : Number, //Rollnumber of Student
	cgpa : Number, //CGPA of Student
	applied_For : [Schema.Types.ObjectId], // Array of ObjectId for companies
	updated : { type: Date, default: Date.now },
}); 

var Students = module.exports = mongoose.model('Student', studentSchema);

module.exports.addStudent = function(student, callback){
	Students.create(student, callback);
}