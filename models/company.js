var mongoose = require('mongoose');

var companySchema = mongoose.Schema({
	name : String, //Name of Company
	placement_date : String, //Date when company is coming for placemnt
	student_Ids : [mongoose.Schema.Types.ObjectId], // Array of ObjectId for Students who have applied to this company
	updated : { type: Date, default: Date.now },
}); 

/*
Creates companies collection. (Monogoose plurarizes the collection name)
Use db.companies.find() to find all entries in mongo 
*/
var Companys = module.exports = mongoose.model('Company', companySchema);


/* 
Saves Company in companys collection
*/
module.exports.registerCompany = function(student, callback){
	Companys.create(student, callback);
}