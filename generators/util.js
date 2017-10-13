var os = require('os');

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function formatText(string, args) {
    for (var i = 1; i < arguments.length; i++) {
        string = string.replace('{' + (i - 1) + '}', arguments[i]);
    }

    return string;
}

function setTabs(number) {
    var result = '';
    
    if (!isNaN(number)) {
        for (var i = 0; i < number; i++) {
            result += '\t';
        }
    }

    return result;
}

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
            searchObject += setTabs(3) + formatText('if (req.query.{0}) {', field.fieldName) + os.EOL;
            searchObject += setTabs(4) + formatText('regex = new RegExp(req.query.{0}, \'i\');', field.fieldName) + os.EOL;
            searchObject += setTabs(4) + formatText('query = query.where(\'{0}\', { $regex: regex });', field.fieldName) + os.EOL;
            searchObject += setTabs(3) + '}';

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
            updateData += setTabs(3) + formatText('{0}: req.body.{1}', field.fieldName, field.fieldName);

            if (i < config.fields.length - 1) {
                updateData += ',' + os.EOL;
            } else {
                updateData += os.EOL;
            }
        }
    }

    updateData += setTabs(2) + '};'

    return updateData;
}

function getRouteValidationDeclaration(config) {
    return os.EOL + setTabs(1) + formatText('var {0}Validation = require(\'../middlewares/{1}\');', config.entityName, config.entityName);
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
            middlewareList += formatText('{0}Validation.{1}Exists, ', config.entityName, field.fieldName);
        }
    }

    return middlewareList;
}

function getMiddlewareRequiredFunctions(config) {
    var required = '';

    required += 'module.exports.required = function (req, res, next) {;' + os.EOL;
    required += setTabs(1) + '\'use strict\';' + os.EOL + os.EOL;

    required += setTabs(1) + 'req.validations = req.validations || [];' + os.EOL + os.EOL;

    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        if (field.required) {
            required += setTabs(1) + formatText('if (!req.body || !req.body.{0}) {', field.fieldName) + os.EOL;
            required += setTabs(2) + formatText('req.validations.push(\'Campo {0} é obrigatório!\');', field.fieldLabel.toLowerCase()) + os.EOL;
            required += setTabs(1) + '}' + os.EOL + os.EOL;
        }
    }

    required += setTabs(1) + 'next();' + os.EOL;
    required += '};' + os.EOL + os.EOL;

    return required;
}

function getMiddlewareUniqueFunctions(config) {
    var unique = '';

    for (i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        if (field.unique) {
            unique += formatText('module.exports.{0}Exists = function (req, res, next) {;', field.fieldName) + os.EOL;
            unique += setTabs(1) + '\'use strict\';' + os.EOL + os.EOL;

            unique += setTabs(1) + formatText('{0}.findOne({{1}: req.body.{2}}, function (err, result) {', config.model.name, field.fieldName, field.fieldName) + os.EOL;
            unique += setTabs(2) + 'if (result && result.id != req.body.id) {' + os.EOL;

            unique += setTabs(3) + 'req.validations = req.validations || [];' + os.EOL + os.EOL;
            unique += setTabs(3) + formatText('req.validations.push(\'{0} com {1} já cadastrado!\');', capitalize(config.entityTitle), field.fieldLabel.toLowerCase()) + os.EOL;
            unique += setTabs(2) + '}' + os.EOL + os.EOL;

            unique += setTabs(2) + 'next();' + os.EOL;
            unique += setTabs(1) + '});' + os.EOL;
            unique += '};' + os.EOL + os.EOL;
        }
    }

    return unique;
}

function getListViewHTMLGridHeader(config) {
    var listingHeaderOutput = '';

    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        listingHeaderOutput += setTabs(9) + '<th>' + field.fieldLabel + '</th>';

        if (i !== config.fields.length - 1) {
            listingHeaderOutput += os.EOL;
        }
    }

    return listingHeaderOutput;
}

function getListViewHTMLGridRow(config) {
    var listingFieldsOutput = '';

    for (i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        listingFieldsOutput += setTabs(9) + '<td data-ng-bind="' + config.entityName + '.' + field.fieldName + '"></td>';

        if (i !== config.fields.length - 1) {
            listingFieldsOutput += os.EOL;
        }
    }

    return listingFieldsOutput;
}

function getDetailsViewHTMLFields(config) {
    var controls = '';

    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        var required = field.required ? 'required' : '';
        var messages = '';

        if (required) {
            messages += setTabs(9) + '<div ng-messages="vm.form.' + field.fieldName + '.$error" multiple ng-if="vm.form.$submitted || vm.form.' + field.fieldName + '.$dirty">';
            messages += setTabs(10) + '<div ng-message="required">Campo obrigatório</div>';
            messages += setTabs(9) + '</div>';
        }
        
        controls += setTabs(10) + '<div class="form-group col-lg-12">';
        controls += setTabs(9) + '<label for="' + field.fieldName + '">' + config.model.name + '</label>';
        controls += setTabs(9) + '<input type="text" id="' + field.fieldName + '" name="' + field.fieldName + '" ' + required + ' class="form-control" data-ng-model="vm.' + config.entityName + '.' + field.fieldName + '">';
        controls += messages;
        controls += setTabs(8) + '</div>' + os.EOL;
    }

    return controls;
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
    getMiddlewareUniqueFunctions: getMiddlewareUniqueFunctions,

    getListViewHTMLGridHeader: getListViewHTMLGridHeader,
    getListViewHTMLGridRow: getListViewHTMLGridRow,

    getDetailsViewHTMLFields: getDetailsViewHTMLFields
};