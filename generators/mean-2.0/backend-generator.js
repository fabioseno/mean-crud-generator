var tools = require('../tools');
var util = require('./util');
var backendFolder = __dirname + '/templates/backend/nodejs/';

function generateModel(config, cb) {
    console.log('Generating model...');

    var template = tools.readTemplate(backendFolder, 'model.js');

    template = templat
        .replace(/{entitymodel_schema}/g, config.server.model.schemaName)
        .replace(/{fields}/g, util.getModelMetadata(config))
        .replace(/{model_name}/g, config.server.model.name);

    tools.writeFile('/backend/models/', config.server.model.filename, template);

    cb(null, true);
}

function generateController(config, cb) {
    console.log('Generating controller...');

    var template = tools.readTemplate(backendFolder, 'controller.js');

    template = template
        .replace(/{entity_name}/g, config.entityName)
        .replace(/{entity_plural_name}/g, config.entityPluralName)
        .replace(/{domain_name}/g, config.server.domain.name)
        .replace(/{entity_label}/g, config.entityLabel);

    tools.writeFile('/backend/controllers/', config.server.controller.filename, template);

    cb(null, true);
}

function generateDomain(config, cb) {
    console.log('Generating domain...');

    var template = tools.readTemplate(backendFolder, 'domain.js');

    template = template
        .replace(/{model_name}/g, config.server.model.name)
        .replace(/{model_filename}/g, config.server.model.filename)
        .replace(/{entity_name}/g, config.entityName)
        .replace(/{search_fields}/, util.getDomainSearchCriteria(config))
        .replace(/{update_fields}/, util.getDomainUpdateFields(config));

    tools.writeFile('/backend/domains/', config.server.domain.filename, template);

    cb(null, true);
}

function generateRoute(config, cb) {
    console.log('Generating route...');

    var template = tools.readTemplate(backendFolder, 'route.js');

    template = template
        .replace(/{entity_plural_name}/g, config.entityPluralName)
        .replace(/{controller_name}/g, config.server.controller.name)
        .replace(/{controller_filename}/g, config.server.controller.filename)
        .replace(/{validation_require}/g, util.getRouteValidationDeclaration(config))
        .replace(/{required_middleware}/g, util.getRouteRequiredMiddleware(config))
        .replace(/{unique_middleware}/g, util.getRouteUniqueMiddleware(config));

    tools.writeFile('/backend/routes/', config.server.route.filename, template);

    cb(null, true);
}

function generateMiddlewares(config, cb) {
    console.log('Generating middleware...');

    var template = tools.readTemplate(backendFolder, 'middleware.js');

    template = template
        .replace(/{entity_name}/g, config.entityName)
        .replace(/{model_name}/g, config.server.model.name)
        .replace(/{field_required}/g, util.getMiddlewareRequiredFunctions(config))
        .replace(/{field_exists}/g, util.getMiddlewareUniqueFunctions(config));

    tools.writeFile('/backend/middlewares/', config.server.middleware.filename, template);

    cb(null, true);
}

module.exports = {
    generateModel: generateModel,
    generateController: generateController,
    generateDomain: generateDomain,
    generateRoute: generateRoute,
    generateMiddlewares: generateMiddlewares
};