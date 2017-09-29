/*global require, module*/
var mongoose = require('mongoose'),
    carSchema = new mongoose.Schema({
	"name": {
		"type": "String",
		"required": true
	},
	"model": {
		"type": "String",
		"required": true
	}
});

carSchema.virtual('id').get(function () {
    'use strict';

    return this._id.toHexString();
});

module.exports = mongoose.model('Car', carSchema);