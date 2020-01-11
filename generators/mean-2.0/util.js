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

function getDomainSearchCriteriaMongo(config) {
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
            searchObject += setTabs(3) + formatText('if (filter.{0}) {', field.fieldName) + os.EOL;
            searchObject += setTabs(4) + formatText('query += \'AND {0} = ? \';', field.fieldName) + os.EOL;
            searchObject += setTabs(4) + formatText('params.push(filter.{0});', field.fieldName) + os.EOL;
            searchObject += setTabs(3) + '}';

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

        updateData += setTabs(4) + formatText('{0}: data.{1}', field.fieldName, field.fieldName);

        if (i !== updateFields.length - 1) {
            updateData += ',';
        }

        updateData += os.EOL;
    }

    updateData += setTabs(3) + '}'

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

function getRouteValidationDeclaration(config) {
    return os.EOL + setTabs(1) + formatText('var {0}Validation = require(\'./{1}\')(context);', config.entityName, config.server.middleware.filename);
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

    required += setTabs(2) + 'required = function (req, res, next) {' + os.EOL;
    required += setTabs(3) + 'try {' + os.EOL;
    required += setTabs(4) + 'req.validations = req.validations || [];' + os.EOL + os.EOL;

    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        if (field.required) {
            required += setTabs(4) + formatText('if (!req.body || !req.body.{0}) {', field.fieldName) + os.EOL;
            required += setTabs(5) + formatText('req.validations.push(\'Campo {0} é obrigatório!\');', field.fieldLabel.toLowerCase()) + os.EOL;
            required += setTabs(4) + '}' + os.EOL + os.EOL;
        }
    }

    required += setTabs(4) + 'if (req.validations.length > 0) {' + os.EOL;
    required += setTabs(5) + 'return messageHandler.wrapResponse(res, req.validations);' + os.EOL;
    required += setTabs(4) + '}' + os.EOL + os.EOL;

    required += setTabs(4) + 'next();' + os.EOL;
    required += setTabs(3) + '}' + os.EOL;
    required += setTabs(3) + 'catch (error) {' + os.EOL;
    required += setTabs(4) + 'return messageHandler.wrapResponse(res, error);' + os.EOL;
    required += setTabs(3) + '}' + os.EOL;
    required += setTabs(2) + '},' + os.EOL + os.EOL;

    return required;
}

function getMiddlewareUniqueFunctions(config) {
    var unique = '';

    for (i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        if (field.unique) {
            unique += setTabs(2) + formatText('{0}Exists = async function (req, res, next) {', field.fieldName) + os.EOL;
            unique += setTabs(3) + 'try {' + os.EOL;
            unique += setTabs(4) + formatText('var {0} = await {1}.findOne({ {2}: req.body.{2} }).exec();', config.entityName, config.server.model.name, field.fieldName) + os.EOL + os.EOL;
            unique += setTabs(4) + formatText('if ({0} && {0}.id != req.body.id) {', config.entityName) + os.EOL;

            unique += setTabs(5) + formatText('return messageHandler.wrapResponse(res, \'{0} com {1} já cadastrado!\');', capitalize(config.entityTitle), field.fieldLabel.toLowerCase()) + os.EOL;
            unique += setTabs(4) + '}' + os.EOL + os.EOL;

            unique += setTabs(4) + 'next();' + os.EOL;
            unique += setTabs(3) + '}' + os.EOL;
            unique += setTabs(3) + 'catch (error) {' + os.EOL;
            unique += setTabs(4) + 'return messageHandler.wrapResponse(res, error);' + os.EOL;
            unique += setTabs(3) + '}' + os.EOL;
            unique += setTabs(2) + '},' + os.EOL + os.EOL;
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
        output += setTabs(2) + 'required: required';

        if (uniqueFields.length > 0) {
            output += ',' + os.EOL;
        }
    }

    for (var i = 0; i < uniqueFields.length; i++) {
        var field = uniqueFields[i];

        output += setTabs(2) + formatText('{0}Exists: {0}Exists', field.fieldName);

        if (i !== uniqueFields.length - 1) {
            output += ',' + os.EOL;
        }
    }

    return output;
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

            if (field.searchFieldType === 'input') {
                listingFieldsOutput += setTabs(7) + '<mat-form-field floatLabel="auto" appearance="standard" class="w-100">' + os.EOL;
                listingFieldsOutput += setTabs(8) + formatText('<mat-label>{0}</mat-label>', field.fieldLabel) + os.EOL;
                listingFieldsOutput += setTabs(8) + formatText('<input matInput name="{0}" [(ngModel)]="filter.{0}">', field.fieldName) + os.EOL;
                listingFieldsOutput += setTabs(7) + '</mat-form-field>' + os.EOL;
            } else if (field.searchFieldType === 'combo') {
                listingFieldsOutput += setTabs(7) + '<mat-form-field floatLabel="auto" appearance="standard" class="w-100">' + os.EOL;
                listingFieldsOutput += setTabs(8) + formatText('<mat-label>{0}</mat-label>', field.fieldLabel) + os.EOL;
                listingFieldsOutput += setTabs(8) + formatText('<mat-select name="{0}" [(ngModel)]="filter.{0}">', field.fieldName) + os.EOL;
                listingFieldsOutput += setTabs(9) + '<mat-option value="">Todos</mat-option>' + os.EOL;
                listingFieldsOutput += setTabs(9) + formatText('<mat-option *ngFor="let {0} of {0}s" [value]="{0}.id">', field.fieldName) + os.EOL;
                listingFieldsOutput += setTabs(10) + formatText('{{{0}.name}}', field.fieldName) + os.EOL;
                listingFieldsOutput += setTabs(9) + '</mat-option>' + os.EOL;
                listingFieldsOutput += setTabs(8) + '</mat-select>' + os.EOL;
                listingFieldsOutput += setTabs(7) + '</mat-form-field>' + os.EOL;
            }

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

    getDomainSearchCriteriaMongo: getDomainSearchCriteriaMongo,
    getDomainSearchCriteriaMySql: getDomainSearchCriteriaMySql,
    getDomainInsertFieldsMySql: getDomainInsertFieldsMySql,
    getDomainInsertFieldParamsMySql: getDomainInsertFieldParamsMySql,
    getDomainUpdateFieldsMongo: getDomainUpdateFieldsMongo,
    getDomainUpdateFieldsMySql: getDomainUpdateFieldsMySql,
    getDomainUpdateFieldParamsMySql: getDomainUpdateFieldParamsMySql,

    getRouteValidationDeclaration: getRouteValidationDeclaration,
    getRouteRequiredMiddleware: getRouteRequiredMiddleware,
    getRouteUniqueMiddleware: getRouteUniqueMiddleware,

    getMiddlewareRequiredFunctions: getMiddlewareRequiredFunctions,
    getMiddlewareUniqueFunctions: getMiddlewareUniqueFunctions,
    getMiddlewareExposedFunctions: getMiddlewareExposedFunctions,

    //getListViewHTMLGridHeader: getListViewHTMLGridHeader,
    getListViewHTMLSearchFields: getListViewHTMLSearchFields,
    getListViewHTMLGridColumns: getListViewHTMLGridColumns,
    getListViewHTMLGridRow: getListViewHTMLGridRow,
    getListViewFilterParams: getListViewFilterParams,

    getDetailsViewHTMLFields: getDetailsViewHTMLFields
};