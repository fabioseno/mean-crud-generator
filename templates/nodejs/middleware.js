/*global require, module*/
var User           = require('../models/user'),
messageHandler = require('../utils/messageHandler');

module.exports.required = function (req, res, next) {
'use strict';

var validations = [];

req.validations = req.validations || [];

if (!req.body || !req.body.firstName) {
    req.validations.push('Campo nome é obrigatório!');
}

if (!req.body || !req.body.lastName) {
    req.validations.push('Campo sobrenome é obrigatório!');
}

if (!req.body || !req.body.email) {
    req.validations.push('Campo e-mail é obrigatório!');
}

if (!req.body || !req.body.birthday) {
    req.validations.push('Campo data de nascimento é obrigatório!');
}

if (!req.body || !req.body.login) {
    req.validations.push('Campo login é obrigatório!');
}

if (!req.body || !req.body.status) {
    req.validations.push('Campo status é obrigatório!');
}

next();
};

module.exports.loginRequired = function (req, res, next) {
'use strict';

var validations = [];

req.validations = req.validations || [];

if (!req.body || !req.body.login) {
    req.validations.push('Campo login é obrigatório!');
}

next();
};

module.exports.passwordRequired = function (req, res, next) {
'use strict';

var validations = [];

req.validations = req.validations || [];

if (!req.body || !req.body.password) {
    req.validations.push('Campo senha é obrigatório!');
}

next();
};

module.exports.loginExists = function (req, res, next) {
'use strict';

User.findOne({ login: req.body.login }, function (err, result) {
    //messageHandler.wrapResponse(res, err, result, null, function () {
    if (result && req.body.login && result.login !== req.body.login) {
        req.validations = req.validations || [];
        req.validations.push('Usuário com login já cadastrado!');
    }
    //});

    next();
});
};

module.exports.emailExists = function (req, res, next) {
'use strict';

User.findOne({email: req.body.email}, function (err, result) {
    //messageHandler.wrapResponse(res, err, result, null, function () {
    if (result && req.body.email && result.email !== req.body.email) {
        req.validations = req.validations || [];
        req.validations.push('Usuário com e-mail já cadastrado!');
    }
    //});

    next();
});
};