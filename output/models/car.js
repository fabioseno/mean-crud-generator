/*global require, module*/
var mongoose = require('mongoose'),
	userSchema = new mongoose.Schema({
		"name": {
			"type": "String",
			"unique": true
		},
		"model": {
			"type": "String"
		}
	});
//model.creationDate = new Date();
);

carSchema.virtual('id').get(function () {
	'use strict';

	return this._id.toHexString();
});

// carSchema.methods.toJSON = function () {
//     var obj = this.toObject()
//     delete obj.password
//     delete obj.creationDate
//     delete obj.lastLogin
//     delete obj.__v
//     return obj
// }

module.exports = mongoose.model('{entityName}', carSchema);