var format = require('../tools/format');
var os = require('os');

function getDataType(dataType) {
    if (dataType === 'Integer' || dataType === 'Decimal') {
        return number;
    } else {
        return dataType;
    }
}

function getModelMetadata(config) {
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

function getDomainSearchCriteriaMongo(config) {
    var searchObject = '';

    searchObject += format.setTabs(3) + 'var regex;' + os.EOL;

    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        if (field.searchField) {
            searchObject += format.setTabs(3) + format.formatText('if (req.query.{0}) {', field.fieldName) + os.EOL;
            searchObject += format.setTabs(4) + format.formatText('regex = new RegExp(req.query.{0}, \'i\');', field.fieldName) + os.EOL;
            searchObject += format.setTabs(4) + format.formatText('query = query.where(\'{0}\', { $regex: regex });', field.fieldName) + os.EOL;
            searchObject += format.setTabs(3) + '}';

            if (i !== config.fields.length - 1) {
                searchObject += os.EOL;
            }
        }
    }

    return searchObject;
}

function getDomainSearchCriteriaMySql(config) {
    var searchObject = '';

    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        if (field.searchField) {
            searchObject += format.setTabs(3) + format.formatText('if (filter.{0}) {', field.fieldName) + os.EOL;
            searchObject += format.setTabs(4) + format.formatText('query += \'AND {0} = ? \';', field.fieldName) + os.EOL;
            searchObject += format.setTabs(4) + format.formatText('params.push(filter.{0});', field.fieldName) + os.EOL;
            searchObject += format.setTabs(3) + '}';

            if (i !== config.fields.length - 1) {
                searchObject += os.EOL;
            }
        }
    }

    return searchObject;
}

function getDomainInsertFieldsMySql(config) {
    return config.fields.map(field => {
        return field.fieldName;
    }).join(', ');
}

function getDomainInsertFieldParamsMySql(config) {
    return config.fields.map(field => {
        return 'data.' + field.fieldName;
    }).join(', ');
}

function getDomainUpdateFieldsMongo(config) {
    var updateData = '';

    updateData += '{' + os.EOL;

    var updateFields = config.fields.filter(field => {
        return field.updateField;
    });

    for (i = 0; i < updateFields.length; i++) {
        var field = updateFields[i];

        updateData += format.setTabs(4) + format.formatText('{0}: data.{1}', field.fieldName, field.fieldName);

        if (i !== updateFields.length - 1) {
            updateData += ',';
        }

        updateData += os.EOL;
    }

    updateData += format.setTabs(3) + '}'

    return updateData;
}

function getDomainUpdateFieldsMySql(config) {
    var updateFields = config.fields.filter(field => {
        return field.updateField;
    });

    return updateFields.map(field => {
        return field.fieldName + ' = ?';
    }).join(', ');
}

function getDomainUpdateFieldParamsMySql(config) {
    var updateFields = config.fields.filter(field => {
        return field.updateField;
    });

    return updateFields.map(field => {
        return 'data.' + field.fieldName;
    }).join(', ');
}

function getDomainOrderByFieldsMySql(config) {
    let result = '';

    let sortFields = config.fields.filter(field => {
        return field.sortField;
    });

    if (sortFields.length > 0) {
        result += '|| ';

        result += sortFields.map(item => '\'' + item.fieldName + '\'').join(', ');
    }

    return result
}

function getRouteValidationDeclaration(config) {
    return os.EOL + format.setTabs(1) + format.formatText('const {0}Validation = require(\'./{1}\')(context);', config.entityName, config.server.middleware.filename);
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
            middlewareList += format.formatText('{0}Validation.{1}Exists, ', config.entityName, field.fieldName);
        }
    }

    return middlewareList;
}

function getMiddlewareRequiredFunctions(config) {
    var required = '';

    required += format.setTabs(1) + 'const required = function (req, res, next) {' + os.EOL;
    required += format.setTabs(2) + 'try {' + os.EOL;
    required += format.setTabs(3) + 'req.validations = req.validations || [];' + os.EOL + os.EOL;

    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        if (field.required) {
            required += format.setTabs(3) + format.formatText('if (!req.body || !req.body.{0}) {', field.fieldName) + os.EOL;
            required += format.setTabs(4) + format.formatText('req.validations.push(\'Campo {0} é obrigatório!\');', field.fieldLabel.toLowerCase()) + os.EOL;
            required += format.setTabs(3) + '}' + os.EOL + os.EOL;
        }
    }

    required += format.setTabs(3) + 'if (req.validations.length > 0) {' + os.EOL;
    required += format.setTabs(4) + 'return messageHandler.wrapErrorResponse(res, req.validations);' + os.EOL;
    required += format.setTabs(3) + '}' + os.EOL + os.EOL;

    required += format.setTabs(3) + 'next();' + os.EOL;
    required += format.setTabs(2) + '}' + os.EOL;
    required += format.setTabs(2) + 'catch (error) {' + os.EOL;
    required += format.setTabs(3) + 'return messageHandler.wrapErrorResponse(res, error);' + os.EOL;
    required += format.setTabs(2) + '}' + os.EOL;
    required += format.setTabs(1) + '};' + os.EOL;

    return required;
}

function getMiddlewareUniqueFunctions(config) {
    var unique = '';

    for (i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        if (field.unique) {
            unique += format.setTabs(2) + format.formatText('{0}Exists = async function (req, res, next) {', field.fieldName) + os.EOL;
            unique += format.setTabs(3) + 'try {' + os.EOL;
            unique += format.setTabs(4) + format.formatText('var {0} = await {1}.findOne({ {2}: req.body.{2} }).exec();', config.entityName, config.server.model.name, field.fieldName) + os.EOL + os.EOL;
            unique += format.setTabs(4) + format.formatText('if ({0} && {0}.id != req.body.id) {', config.entityName) + os.EOL;

            unique += format.setTabs(5) + format.formatText('return messageHandler.wrapErrorResponse(res, \'{0} com {1} já cadastrado!\');', format.capitalize(config.entityTitle), field.fieldLabel.toLowerCase()) + os.EOL;
            unique += format.setTabs(4) + '}' + os.EOL + os.EOL;

            unique += format.setTabs(4) + 'next();' + os.EOL;
            unique += format.setTabs(3) + '}' + os.EOL;
            unique += format.setTabs(3) + 'catch (error) {' + os.EOL;
            unique += format.setTabs(4) + 'return messageHandler.wrapErrorResponse(res, error);' + os.EOL;
            unique += format.setTabs(3) + '}' + os.EOL;
            unique += format.setTabs(2) + '},' + os.EOL + os.EOL;
        }
    }

    return unique;
}

function getMiddlewareExposedFunctions(config) {
    var output = '';

    var requiredField = config.fields.find(field => {
        return field.required;
    });

    var uniqueFields = config.fields.filter(field => {
        return field.unique;
    });

    if (requiredField) {
        output += format.setTabs(2) + 'required';

        if (uniqueFields.length > 0) {
            output += ',' + os.EOL;
        }
    }

    for (var i = 0; i < uniqueFields.length; i++) {
        var field = uniqueFields[i];

        output += format.setTabs(2) + format.formatText('{0}Exists', field.fieldName);

        if (i !== uniqueFields.length - 1) {
            output += ',' + os.EOL;
        }
    }

    return output;
}

module.exports = {
    getModelMetadata,

    getDomainSearchCriteriaMongo,
    getDomainSearchCriteriaMySql,
    getDomainInsertFieldsMySql,
    getDomainInsertFieldParamsMySql,
    getDomainUpdateFieldsMongo,
    getDomainUpdateFieldsMySql,
    getDomainUpdateFieldParamsMySql,
    getDomainOrderByFieldsMySql,

    getRouteValidationDeclaration,
    getRouteRequiredMiddleware,
    getRouteUniqueMiddleware,

    getMiddlewareRequiredFunctions,
    getMiddlewareUniqueFunctions,
    getMiddlewareExposedFunctions
};