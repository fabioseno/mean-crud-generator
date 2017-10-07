/*global require, module*/
var User = require('../models/car'),
    messageHandler = require('../utils/messageHandler');

module.exports.required = function (req, res, next) {;
	'use strict';

	req.validations = req.validations || [];

	if (!req.body || !req.body.name) {
		req.validations.push('Campo nome é obrigatório!');
	}

	if (!req.body || !req.body.model) {
		req.validations.push('Campo modelo é obrigatório!');
	}

	next();
};

module.exports.nameExists = function (req, res, next) {;
	'use strict';

	Car.findOne({name: req.query.name}, function (err, result) {
		if (result && req.query.name & result.name != req.query.name) {
			req.validations = req.validations || [];
			req.validations.push('Carro com nome já cadastrado!');
		}

		next();
	});
};

module.exports.modelExists = function (req, res, next) {;
	'use strict';

	Car.findOne({model: req.query.model}, function (err, result) {
		if (result && req.query.model & result.model != req.query.model) {
			req.validations = req.validations || [];
			req.validations.push('Carro com modelo já cadastrado!');
		}

		next();
	});
};

