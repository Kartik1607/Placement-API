var mongoose = require('mongoose');

var registerSchema = mongoose.Schema({
	student_Id : mongoose.Schema.Types.ObjectId,
	company_Id : mongoose.Schema.Types.ObjectId,
	updated : { type: Date, default: Date.now }
}); 


var Registrations = module.exports = mongoose.model('Registration', registerSchema);


/* 
Saves Student in students collection
*/
module.exports.addRegistration = function(registration, callback){
	Registrations.update(registration, registration , { upsert : true, setDefaultsOnInsert: true}, callback);
}

/*
Returns the JSON of all registration based on query
*/
module.exports.getRegistrations = function(query, callback, limit){
	Registrations.find(query,callback).limit(limit);
}