var os = require('os');

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function setTabs(number) {
    return result = '';

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
            searchObject += util.setTabs(3) + 'if (req.query.' + field.fieldName + ') {' + os.EOL;
            searchObject += util.setTabs(4) + 'regex = new RegExp(req.query.' + field.fieldName + ', \'i\');' + os.EOL;
            searchObject += util.setTabs(4) + 'query = query.where(\'' + field.fieldName + '\', { $regex: regex });' + os.EOL;
            searchObject += util.setTabs(3) + '}';

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
            updateData += util.setTabs(3) + field.fieldName + ': req.body.' + field.fieldName;

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
    return os.EOL + util.setTabs(1) + 'var ' + config.entityName + 'Validation = require(\'../middlewares/' + config.entityName + '\');';
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
    required += util.setTabs(1) + '\'use strict\';' + os.EOL + os.EOL;

    required += util.setTabs(1) + 'req.validations = req.validations || [];' + os.EOL + os.EOL;

    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        if (field.required) {
            required += util.setTabs(1) + 'if (!req.body || !req.body.' + field.fieldName + ') {' + os.EOL;
            required += util.setTabs(2) + 'req.validations.push(\'Campo ' + field.fieldLabel.toLowerCase() + ' é obrigatório!\');' + os.EOL;
            required += util.setTabs(1) + '}' + os.EOL + os.EOL;
        }
    }

    required += util.setTabs(1) + 'next();' + os.EOL;
    required += '};' + os.EOL + os.EOL;

    return required;
}

function getMiddlewareUniqueFunctions(config) {
    var unique = '';

    for (i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        if (field.unique) {
            unique += `module.exports.` + field.fieldName + `Exists = function (req, res, next) {;` + os.EOL
            unique += util.setTabs(1) + '\'use strict\';' + os.EOL + os.EOL;

            unique += util.setTabs(1) + config.model.name + '.findOne({' + field.fieldName + ': ' + 'req.body.' + field.fieldName + '}, function (err, result) {' + os.EOL;
            unique += util.setTabs(2) + 'if (result && result.id != req.body.id) {' + os.EOL;

            unique += util.setTabs(3) + 'req.validations = req.validations || [];' + os.EOL + os.EOL;
            unique += util.setTabs(3) + 'req.validations.push(\'' + capitalize(config.entityTitle) + ' com ' + field.fieldLabel.toLowerCase() + ' já cadastrado!\');' + os.EOL
            unique += util.setTabs(2) + '}' + os.EOL + os.EOL;

            unique += util.setTabs(2) + 'next();' + os.EOL;
            unique += util.setTabs(1) + '});' + os.EOL;
            unique += '};' + os.EOL + os.EOL;
        }
    }

    return unique;
}

function getListViewHTMLGridHeader(config) {
    var listingHeaderOutput = '';

    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        listingHeaderOutput += util.setTabs(9) + '<th>' + field.fieldLabel + '</th>';

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

        listingFieldsOutput += util.setTabs(9) + '<td data-ng-bind="' + config.entityName + '.' + field.fieldName + '"></td>';

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
        var messages = required ? `\t\t\t\t\t\t\t\t\t<div ng-messages="vm.form.` + field.fieldName + `.$error" multiple ng-if="vm.form.$submitted || vm.form.` + field.fieldName + `.$dirty">
        \t\t\t\t\t\t\t\t\t\t<div ng-message="required">Campo obrigatório</div>
        \t\t\t\t\t\t\t\t\t</div>` : '';
        
        controls += `\t\t\t\t\t\t\t\t\t\t<div class="form-group col-lg-12">
        \t\t\t\t\t\t\t\t\t<label for="` + field.fieldName + `">` + config.model.name + `</label>
        \t\t\t\t\t\t\t\t\t<input type="text" id="` + field.fieldName + `" name="` + field.fieldName + `" ` + required + ` class="form-control" data-ng-model="vm.` + config.entityName + `.` + field.fieldName + `">
        ` + messages + `
        \t\t\t\t\t\t\t\t</div>` + os.EOL;
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