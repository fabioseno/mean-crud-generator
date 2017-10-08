var os = require('os');

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

function getSearchCriteria(config) {
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

function getUpdateFields(config) {
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

module.exports = {
    getModelMetadata: getModelMetadata,

    getControllerSearchCriteria: getControllerSearchCriteria,
    getControllerUpdateFields: getControllerUpdateFields,
    
    getRouteValidationDeclaration: getRouteValidationDeclaration,
    getRouteRequiredMiddleware: getRouteRequiredMiddleware,
    getRouteUniqueMiddleware: getRouteUniqueMiddleware
};