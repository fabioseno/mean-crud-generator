var os = require('os');

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function getDataType(dataType) {
    if (dataType === 'Integer' || dataType === 'Decimal') {
        return number;
    } else {
        return dataType;
    }
}

function getModelMetadata(config) {
    var result = '';
    var obj = {};

    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        obj[field.fieldName] = {
            type: getDataType(field.dataType)
        }

        if (field.unique) {
            obj[field.fieldName].unique = true;
        }

        if (field.required) {
            obj[field.fieldName].required = true;
        }
    }

    return JSON.stringify(obj, null, '\t')
}

function getControllerSearchCriteria(config) {
    var searchObject = '';

    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        if (field.searchField) {
            searchObject += '\t\t\tif (req.query.' + field.fieldName + ') {' + os.EOL;
            searchObject += '\t\t\t\tregex = new RegExp(req.query.' + field.fieldName + ', \'i\');' + os.EOL;
            searchObject += '\t\t\t\tquery = query.where(\'' + field.fieldName + '\', { $regex: regex });' + os.EOL;
            searchObject += '\t\t\t}';

            if (i !== config.fields.length - 1) {
                searchObject += os.EOL + os.EOL;
            }
        }
    }

    return searchObject;
}

function getControllerUpdateFields(config) {
    var updateData = 'var data = {' + os.EOL;

    for (i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        if (field.updateField) {
            updateData += '\t\t\t' + field.fieldName + ': req.body.' + field.fieldName;

            if (i < config.fields.length - 1) {
                updateData += ',' + os.EOL;
            } else {
                updateData += os.EOL;
            }
        }
    }

    updateData += '\t\t};'

    return updateData;
}

function getRouteValidationDeclaration(config) {
    return os.EOL + '\tvar ' + config.entityName + 'Validation = require(\'../middlewares/' + config.entityName + '\');';
}

function getRouteRequiredMiddleware(config) {
    var required = '';

    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        if (field.required) {
            required = config.entityName + 'Validation.required, ';
            break;
        }
    }

    return required;
}

function getRouteUniqueMiddleware(config) {
    var middlewareList = '';

    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        if (field.unique) {
            middlewareList += config.entityName + 'Validation.' + field.fieldName + 'Exists, ';
        }
    }

    return middlewareList;
}

function getMiddlewareRequiredFunctions(config) {
    var required = '';

    required += 'module.exports.required = function (req, res, next) {;' + os.EOL;
    required += '\t\'use strict\';' + os.EOL + os.EOL;

    required += '\treq.validations = req.validations || [];' + os.EOL + os.EOL;

    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        if (field.required) {
            required += '\tif (!req.body || !req.body.' + field.fieldName + ') {' + os.EOL;
            required += '\t\treq.validations.push(\'Campo ' + field.fieldLabel.toLowerCase() + ' é obrigatório!\');' + os.EOL;
            required += '\t}' + os.EOL + os.EOL;
        }
    }

    required += '\tnext();' + os.EOL;
    required += '};' + os.EOL + os.EOL;

    return required;
}

function getMiddlewareUniqueFunctions(config) {
    var unique = '';

    for (i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        if (field.unique) {
            unique += `module.exports.` + field.fieldName + `Exists = function (req, res, next) {;` + os.EOL
            unique += '\t\'use strict\';' + os.EOL + os.EOL;

            unique += '\t' + config.model.name + '.findOne({' + field.fieldName + ': ' + 'req.query.' + field.fieldName + '}, function (err, result) {' + os.EOL;
            unique += '\t\tif (result && req.query.' + field.fieldName + ' & result.' + field.fieldName + ' != req.query.' + field.fieldName + ') {' + os.EOL;

            unique += '\t\t\treq.validations = req.validations || [];' + os.EOL;
            unique += '\t\t\treq.validations.push(\'' + capitalize(config.entityTitle) + ' com ' + field.fieldLabel.toLowerCase() + ' já cadastrado!\');' + os.EOL
            unique += '\t\t}' + os.EOL + os.EOL;

            unique += '\t\tnext();' + os.EOL;
            unique += '\t});' + os.EOL;
            unique += '};' + os.EOL + os.EOL;
        }
    }

    return unique;
}

module.exports = {
    capitalize: capitalize,
    
    getModelMetadata: getModelMetadata,

    getControllerSearchCriteria: getControllerSearchCriteria,
    getControllerUpdateFields: getControllerUpdateFields,

    getRouteValidationDeclaration: getRouteValidationDeclaration,
    getRouteRequiredMiddleware: getRouteRequiredMiddleware,
    getRouteUniqueMiddleware: getRouteUniqueMiddleware,

    getMiddlewareRequiredFunctions: getMiddlewareRequiredFunctions,
    getMiddlewareUniqueFunctions: getMiddlewareUniqueFunctions
};