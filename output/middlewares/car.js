/*global require, module*/
var User = require('../models/car'),
    messageHandler = require('../utils/messageHandler');

module.exports.required = function (req, res, next) {
    'use strict';

    var validations = [];

    req.validations = req.validations || [];
{required_fields}

    next();
};

module.exports.nameRequired = function (req, res, next) {;
    'use strict';

    req.validations = req.validations || [];
            
    if (!req.body || !req.body.{}) {
        req.validations.push('Campo nome é obrigatório!');
    }
            
    next();
};

module.exports.modelRequired = function (req, res, next) {;
    'use strict';

    req.validations = req.validations || [];
            
    if (!req.body || !req.body.{}) {
        req.validations.push('Campo modelo é obrigatório!');
    }
            
    next();
};



{field_exists}

// module.exports.loginRequired = function (req, res, next) {
//     'use strict';

//     var validations = [];

//     req.validations = req.validations || [];

//     if (!req.body || !req.body.login) {
//         req.validations.push('Campo login é obrigatório!');
//     }

//     next();
// };

// module.exports.loginExists = function (req, res, next) {
//     'use strict';

//     User.findOne({
//         login: req.body.login
//     }, function (err, result) {
//         //messageHandler.wrapResponse(res, err, result, null, function () {
//         if (result && req.body.login && result.login !== req.body.login) {
//             req.validations = req.validations || [];
//             req.validations.push('Usuário com login já cadastrado!');
//         }
//         //});

//         next();
//     });
// };

// module.exports.emailExists = function (req, res, next) {
//     'use strict';

//     User.findOne({
//         email: req.body.email
//     }, function (err, result) {
//         //messageHandler.wrapResponse(res, err, result, null, function () {
//         if (result && req.body.email && result.email !== req.body.email) {
//             req.validations = req.validations || [];
//             req.validations.push('Usuário com e-mail já cadastrado!');
//         }
//         //});

//         next();
//     });
// };