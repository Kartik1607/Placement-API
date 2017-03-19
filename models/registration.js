var mongoose = require('mongoose');

var registerSchema = mongoose.Schema({
	data : [{
   		student_Id : mongoose.Schema.Types.ObjectId,
		company_Id : mongoose.Schema.Types.ObjectId,
		_id : false
	}],
	updated : { type: Date, default: Date.now }
}); 


var Registrations = module.exports = mongoose.model('Registration', registerSchema);

Registrations.create({},function(err,res){
	if(err){
		throw err;
	}

});

/* 
Saves Student in students collection
*/
module.exports.addRegistration = function(sId, cId, callback){
	Registrations.update({
	},{
		$addToSet:{
			data : {
				student_Id : sId,
				company_Id : cId
			}
		}
	}, callback);
}

/*
Returns the JSON of all registration based on query
*/
module.exports.getRegistrations = function(query, callback, limit){
	Registrations.find(query,callback).limit(limit);
}