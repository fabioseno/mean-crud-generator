var tools = require('../tools');
var util = require('./util');
var backendFolder = __dirname + '/templates/backend/nodejs/';

function generateModel(config, cb) {
    console.log('Generating model...');

    var template = tools.readTemplate(backendFolder, 'model.js');

    template = template.replace(/{entity_model_schema}/g, config.model.schemaName);
    template = template.replace(/{fields}/g, util.getModelMetadata(config));
    template = template.replace(/{model_name}/g, config.model.name);

    tools.writeFile('/backend/models/', config.model.filename, template);

    cb(null, true);
}

function generateController(config, cb) {
    console.log('Generating controller...');

    var template = tools.readTemplate(backendFolder, 'controller.js');

    template = template.replace(/{entity_name}/g, config.entityName);
    template = template.replace(/{model_name}/g, config.model.name);
    template = template.replace(/{model_filename}/g, config.model.filename);
    template = template.replace(/{entity_plural_name}/g, config.entityPluralName);
    template = template.replace(/{search_fields}/, util.getControllerSearchCriteria(config));
    template = template.replace(/{update_fields}/, util.getControllerUpdateFields(config));

    tools.writeFile('/backend/controllers/', config.controller.filename, template);

    cb(null, true);
}

function generateRoute(config, cb) {
    console.log('Generating route...');

    var template = tools.readTemplate(backendFolder, 'route.js');

    template = template.replace(/{entity_plural_name}/g, config.entityPluralName);
    template = template.replace(/{controller_name}/g, config.controller.name);
    template = template.replace(/{controller_filename}/g, config.controller.filename);
    template = template.replace(/{validation_require}/g, util.getRouteValidationDeclaration(config));
    template = template.replace(/{required_middleware}/g, util.getRouteRequiredMiddleware(config));
    template = template.replace(/{unique_middleware}/g, util.getRouteUniqueMiddleware(config));

    tools.writeFile('/backend/routes/', config.route.filename, template);

    cb(null, true);
}

function generateMiddlewares(config, cb) {
    console.log('Generating middleware...');

    var template = tools.readTemplate(backendFolder, 'middleware.js');

    template = template.replace(/{entity_name}/g, config.entityName);
    template = template.replace(/{model_name}/g, config.model.name);
    template = template.replace(/{field_required}/g, util.getMiddlewareRequiredFunctions(config));
    template = template.replace(/{field_exists}/g, util.getMiddlewareUniqueFunctions(config));

    tools.writeFile('/backend/middlewares/', config.middleware.filename, template);

    cb(null, true);
}

module.exports = {
    generateModel: generateModel,
    generateController: generateController,
    generateRoute: generateRoute,
    generateMiddlewares: generateMiddlewares
};