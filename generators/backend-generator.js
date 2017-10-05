var tools = require('./tools');
var os = require('os');
var backendFolder = 'nodejs';

function getDataType(dataType) {
    if (dataType === 'Integer' || dataType === 'Decimal') {
        return number;
    } else {
        return dataType;
    }
}

function generateModel(config, cb) {
    console.log('Generating model...');

    var template = tools.readTemplate(backendFolder, 'model.js');

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

    template = template.replace(/{entityModelSchema}/g, config.model.schemaName);
    template = template.replace(/{fields}/g, JSON.stringify(obj, null, '\t'));
    template = template.replace(/{modelName}/g, config.model.name);

    tools.writeFile('/models/' + config.model.filename, template);

    cb(null, true);
}

function generateController(config, cb) {
    console.log('Generating controller...');

    var template = tools.readTemplate(backendFolder, 'controller.js');

    template = template.replace(/{entityName}/g, config.entityName);
    template = template.replace(/{modelName}/g, config.model.name);
    template = template.replace(/{modelFilename}/g, config.model.filename);
    template = template.replace(/{pluralEntityName}/g, config.model.pluralName);

    // search criteria
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

    template = template.replace(/{search_fields}/, searchObject);

    // update fields
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

    template = template.replace(/{update_fields}/, updateData);

    tools.writeFile('/controllers/' + config.controller.filename, template);

    cb(null, true);
}

function generateRoute(config, cb) {
    console.log('Generating route...');

    var template = tools.readTemplate(backendFolder, 'route.js');

    template = template.replace(/{pluralEntityName}/g, config.model.pluralName);
    template = template.replace(/{controllerName}/g, config.controller.name);
    template = template.replace(/{controllerFilename}/g, config.controller.filename);

    tools.writeFile('/routes/' + config.route.filename, template);

    cb(null, true);
}

function generateMiddlewares(config, cb) {
    console.log('Generating middleware...');

    var template = tools.readTemplate(backendFolder, 'middleware.js');

    template = template.replace(/{entity_name}/g, config.entityName);

    // required
    var required = '';

    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        required += `module.exports.` + field.fieldName + `Required = function (req, res, next) {;
    'use strict';

    req.validations = req.validations || [];
            
    if (!req.body || !req.body.{' + field.fieldName + '}) {
        req.validations.push('Campo ` + field.fieldLabel.toLowerCase() + ` é obrigatório!');
    }
            
    next();
};` + os.EOL + os.EOL;
    }

    template = template.replace(/{field_required}/g, required);

    // unique
    var unique = '';

    for (i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        unique += `module.exports.` + field.fieldName + `Required = function (req, res, next) {;
    'use strict';

    req.validations = req.validations || [];
                    
    if (!req.body || !req.body.{}) {
        req.validations.push('Campo ` + field.fieldLabel.toLowerCase() + ` é obrigatório!');
    }
                    
                next();
            };` + os.EOL + os.EOL;
    }

    template = template.replace(/{field_exists}/g, unique);

}

module.exports = {
    generateModel: generateModel,
    generateController: generateController,
    generateRoute: generateRoute,
    generateMiddlewares: generateMiddlewares
};