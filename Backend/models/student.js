var mongoose = require('mongoose');

var studentSchema = mongoose.Schema({
	name : String, //Name of Student
	department : String, //Departemnt of Student. eg CSE, IT etc
	rollno : Number, //Rollnumber of Student
	cgpa : Number, //CGPA of Student
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


/*Updates Single or multiple Students based on query */
module.exports.updateStudents = function(query, student, callback){
	Students.update(query, student, { multi: true }, callback);
}

/*
Returns all the students
*/
module.exports.getStudents = function(query, callback, limit){
	Students.find(query, callback).limit(limit);
}



module.exports.removeStudents = function(query, callback){
	Students.remove(query, callback);
}