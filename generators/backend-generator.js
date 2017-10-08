var tools = require('./tools');
var os = require('os');
var util = require('./util');
var backendFolder = 'nodejs';

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function generateModel(config, cb) {
    console.log('Generating model...');

    var template = tools.readTemplate(backendFolder, 'model.js');

    template = template.replace(/{entityModelSchema}/g, config.model.schemaName);
    template = template.replace(/{fields}/g, util.getModelMetadata(config));
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
    template = template.replace(/{search_fields}/, util.getSearchCriteria(config));
    template = template.replace(/{update_fields}/, util.getUpdateFields(config));

    tools.writeFile('/controllers/' + config.controller.filename, template);

    cb(null, true);
}

function generateRoute(config, cb) {
    console.log('Generating route...');

    var template = tools.readTemplate(backendFolder, 'route.js');

    template = template.replace(/{plural_entity_name}/g, config.model.pluralName);
    template = template.replace(/{controller_name}/g, config.controller.name);
    template = template.replace(/{controller_filename}/g, config.controller.filename);

    // validation require
    var validationRequire = os.EOL;
    validationRequire += '\tvar ' + config.entityName + 'Validation = require(\'../middlewares/' + config.entityName + '\');';
    template = template.replace(/{validation_require}/g, validationRequire);

    // middleware list
    var required = '';
    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        if (field.required) {
            required = config.entityName + 'Validation.required, ';
            break;
        }
    }
    template = template.replace(/{required_middleware}/g, required);

    var middlewareList = '';
    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        if (field.unique) {
            middlewareList += config.entityName + 'Validation.' + field.fieldName + 'Exists, ';
        }
    }

    template = template.replace(/{middleware_list}/g, middlewareList);

    tools.writeFile('/routes/' + config.route.filename, template);

    cb(null, true);
}

function generateMiddlewares(config, cb) {
    console.log('Generating middleware...');

    var template = tools.readTemplate(backendFolder, 'middleware.js');

    template = template.replace(/{entity_name}/g, config.entityName);

    // required
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

    template = template.replace(/{field_required}/g, required);

    // unique
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

    template = template.replace(/{field_exists}/g, unique);

    tools.writeFile('/middlewares/' + config.entityName + '.js', template);

    cb(null, true);
}

module.exports = {
    generateModel: generateModel,
    generateController: generateController,
    generateRoute: generateRoute,
    generateMiddlewares: generateMiddlewares
};