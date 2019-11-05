var os = require('os');

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function formatText(string, args) {
    for (var i = 1; i < arguments.length; i++) {
        var param = '\\{' + (i - 1) + '\\}';
        string = string.replace(new RegExp(param, 'g'), arguments[i]);
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

function getDomainSearchCriteria(config) {
    var searchObject = '';

    searchObject += setTabs(3) + 'var regex;' + os.EOL;

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

function getDomainUpdateFields(config) {
    var updateData = '';
    var entityName = config.entityName;

    updateData += setTabs(3) + formatText('if ({0}) {', entityName) + os.EOL;

    for (i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        if (field.updateField) {
            updateData += setTabs(4) + formatText('{0}.{1} = data.{2}', config.entityName, field.fieldName, field.fieldName);

            if (i < config.fields.length - 1) {
                updateData += ',' + os.EOL;
            } else {
                updateData += os.EOL;
            }
        }
    }

    updateData += setTabs(3) + '}'

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

    required += 'module.exports.required = function (req, res, next) {' + os.EOL;
    required += setTabs(1) + 'try {' + os.EOL;
    required += setTabs(2) + 'req.validations = req.validations || [];' + os.EOL + os.EOL;

    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        if (field.required) {
            required += setTabs(2) + formatText('if (!req.body || !req.body.{0}) {', field.fieldName) + os.EOL;
            required += setTabs(3) + formatText('req.validations.push(\'Campo {0} é obrigatório!\');', field.fieldLabel.toLowerCase()) + os.EOL;
            required += setTabs(2) + '}' + os.EOL + os.EOL;
        }
    }

    required += setTabs(2) + 'if (req.validations.length > 0) {' + os.EOL;
    required += setTabs(3) + 'return messageHandler.wrapResponse(res, req.validations);' + os.EOL;
    required += setTabs(2) + '}' + os.EOL + os.EOL;

    required += setTabs(2) + 'next();' + os.EOL;
    required += setTabs(1) + '}' + os.EOL;
    required += setTabs(1) + 'catch (error) {' + os.EOL;
    required += setTabs(2) + 'return messageHandler.wrapResponse(res, error);' + os.EOL;
    required += setTabs(1) + '}' + os.EOL;
    required += '};' + os.EOL + os.EOL;

    return required;
}

function getMiddlewareUniqueFunctions(config) {
    var unique = '';

    for (i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        if (field.unique) {
            unique += formatText('module.exports.{0}Exists = function (req, res, next) {', field.fieldName) + os.EOL;
            unique += setTabs(1) + 'try {' + os.EOL;
            unique += setTabs(2) + formatText('{0}.findOne({{1}: req.body.{2}}, function (err, result) {', config.server.model.name, field.fieldName, field.fieldName) + os.EOL;
            unique += setTabs(3) + 'if (result && result.id != req.body.id) {' + os.EOL;
            unique += setTabs(4) + 'req.validations = req.validations || [];' + os.EOL + os.EOL;
            unique += setTabs(4) + formatText('req.validations.push(\'{0} com {1} já cadastrado!\');', capitalize(config.entityTitle), field.fieldLabel.toLowerCase()) + os.EOL;
            unique += setTabs(3) + '}' + os.EOL + os.EOL;

            unique += setTabs(3) + 'if (req.validations.length > 0) {' + os.EOL;
            unique += setTabs(4) + 'return messageHandler.wrapResponse(res, req.validations);' + os.EOL;
            unique += setTabs(3) + '}' + os.EOL + os.EOL;

            unique += setTabs(3) + 'next();' + os.EOL;
            unique += setTabs(2) + '});' + os.EOL;
            unique += setTabs(1) + '}' + os.EOL;
            unique += setTabs(1) + 'catch (error) {' + os.EOL;
            unique += setTabs(2) + 'return messageHandler.wrapResponse(res, error);' + os.EOL;
            unique += setTabs(1) + '}' + os.EOL;
            unique += '};' + os.EOL + os.EOL;
        }
    }

    return unique;
}

function getListViewHTMLSearchFields(config) {
    var listingFieldsOutput = '';
    var searchFieldFound = config.fields.find(function (item) {
        return item.searchField;
    });

    if (searchFieldFound) {
        listingFieldsOutput += setTabs(4) + formatText('<form (ngSubmit)="list{0}(true)">', config.server.model.pluralName) + os.EOL;
        listingFieldsOutput += setTabs(5) + '<div class="row">' + os.EOL;
    }

    for (i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        if (field.searchField) {
            listingFieldsOutput += setTabs(6) + '<div class="col-md-3">' + os.EOL;
            listingFieldsOutput += setTabs(7) + '<mat-form-field floatLabel="auto" appearance="standard" class="w-100">' + os.EOL;
            listingFieldsOutput += setTabs(8) + formatText('<mat-label>{0}</mat-label>', field.fieldName) + os.EOL;
            listingFieldsOutput += setTabs(8) + formatText('<input matInput name="{0}" [(ngModel)]="filter.{0}">', field.fieldName) + os.EOL;
            listingFieldsOutput += setTabs(7) + '</mat-form-field>' + os.EOL;
            listingFieldsOutput += setTabs(6) + '</div>' + os.EOL;
        }
    }

    if (searchFieldFound) {
        listingFieldsOutput += setTabs(6) + '<div class="col-md-2 row-center">' + os.EOL;
        listingFieldsOutput += setTabs(7) + '<button mat-raised-button type="submit" color="primary" class="btn-w-md">Filtrar</button>' + os.EOL;
        listingFieldsOutput += setTabs(6) + '</div>' + os.EOL;
        listingFieldsOutput += setTabs(5) + '</div>' + os.EOL;
        listingFieldsOutput += setTabs(4) + '</form>' + os.EOL;
        listingFieldsOutput += setTabs(4) + '<span class="space space-md"></span>';
    }

    return listingFieldsOutput;
}

function getListViewHTMLGridColumns(config) {
    var listingFieldsOutput = '';
    var columns = [];

    for (i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        columns.push(formatText('\'{0}\'', field.fieldName));
    }

    listingFieldsOutput = formatText('[{0}];', columns.join(', ')) + os.EOL;

    return listingFieldsOutput;
}

function getListViewHTMLGridRow(config) {
    var listingFieldsOutput = '';

    for (i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];
        listingFieldsOutput += setTabs(6) + formatText('<mat-text-column name="{0}" headerText="{1}"></mat-text-column>', field.fieldName, field.fieldLabel);

        if (i !== config.fields.length - 1) {
            listingFieldsOutput += os.EOL;
        }
    }

    return listingFieldsOutput;
}

function getListViewFilterParams(config) {
    var listingFieldsOutput = '';

    for (i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        listingFieldsOutput += setTabs(2) + formatText('this.addFilterParam(params, \'{0}\', this.filter.{0});', field.fieldName) + os.EOL;

        // if (i !== config.fields.length - 1) {
        //     listingFieldsOutput += os.EOL;
        // }
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
            messages += setTabs(11) + formatText('<div ng-messages="vm.form.{0}.$error" multiple ng-if="vm.form.$submitted || vm.form.{1}.$dirty">', field.fieldName, field.fieldName) + os.EOL;
            messages += setTabs(12) + '<div ng-message="required">Campo obrigatório</div>' + os.EOL;
            messages += setTabs(11) + '</div>' + os.EOL;
        }

        controls += os.EOL;
        controls += setTabs(10) + '<div class="form-group col-lg-12">' + os.EOL;
        controls += setTabs(11) + formatText('<label for="{0}">{1}</label>', field.fieldName, config.server.model.name) + os.EOL;
        controls += setTabs(11) + formatText('<input type="text" id="{0}" name="{1}" {2} class="form-control" data-ng-model="vm.{3}.{4}">', field.fieldName, field.fieldName, required, config.entityName, field.fieldName) + os.EOL;
        controls += messages;
        controls += setTabs(10) + '</div>';
    }

    return controls;
}

module.exports = {
    capitalize: capitalize,

    getModelMetadata: getModelMetadata,

    getDomainSearchCriteria: getDomainSearchCriteria,
    getDomainUpdateFields: getDomainUpdateFields,

    getRouteValidationDeclaration: getRouteValidationDeclaration,
    getRouteRequiredMiddleware: getRouteRequiredMiddleware,
    getRouteUniqueMiddleware: getRouteUniqueMiddleware,

    getMiddlewareRequiredFunctions: getMiddlewareRequiredFunctions,
    getMiddlewareUniqueFunctions: getMiddlewareUniqueFunctions,

    //getListViewHTMLGridHeader: getListViewHTMLGridHeader,
    getListViewHTMLSearchFields: getListViewHTMLSearchFields,
    getListViewHTMLGridColumns: getListViewHTMLGridColumns,
    getListViewHTMLGridRow: getListViewHTMLGridRow,
    getListViewFilterParams: getListViewFilterParams,

    getDetailsViewHTMLFields: getDetailsViewHTMLFields
};