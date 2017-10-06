/*global require, module*/
var User = require('../models/car'),
    messageHandler = require('../utils/messageHandler');

module.exports.nameRequired = function (req, res, next) {;
    'use strict';

    req.validations = req.validations || [];
            
    if (!req.body || !req.body.name) {
        req.validations.push('Campo nome é obrigatório!');
    }
            
    next();
};

module.exports.modelRequired = function (req, res, next) {;
    'use strict';

    req.validations = req.validations || [];
            
    if (!req.body || !req.body.model) {
        req.validations.push('Campo modelo é obrigatório!');
    }
            
    next();
};


module.exports.nameExists = function (req, res, next) {;
	'use strict';

	Car.findOne({name: req.query.name}, function (err, result) {
		if (result && req.query.undefined & result.name != req.query.name) {
			req.validations = req.validations || [];
			req.validations.push('carro com Nome já cadastrado!');
		}

		next();
	});
};
