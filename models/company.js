var mongoose = require('mongoose');

var companySchema = mongoose.Schema({
	name : String, //Name of Company
	placement_date : String, //Date when company is coming for placemnt
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

/*
Returns all the companys
*/
module.exports.getCompanies = function(query, callback, limit){
	Companys.find(query, callback).limit(limit);
}

module.exports.removeCompany = function(query, callback) {
	Companys.remove(query,callback);
}