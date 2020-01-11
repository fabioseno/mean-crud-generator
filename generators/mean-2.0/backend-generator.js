var tools = require('../tools');
var util = require('./util');
var backendFolder = __dirname + '/templates/backend/nodejs/';

function generateModel(config, cb) {
    console.log('Generating model...');

    var template = tools.readTemplate(backendFolder, 'model.js');

    template = template
        .replace(/{entity_model_schema}/g, config.server.model.schemaName)
        .replace(/{fields}/g, util.getModelMetadata(config))
        .replace(/{model_name}/g, config.server.model.name);

    tools.writeFile('/backend/' + config.entityName + '/', config.server.model.filename, template);

    cb(null, true);
}

function generateController(config, cb) {
    console.log('Generating controller...');

    var template = tools.readTemplate(backendFolder, 'controller.js');

    template = template
        .replace(/{entity_name}/g, config.entityName)
        .replace(/{entity_plural_name}/g, config.entityPluralName)
        .replace(/{domain_name}/g, config.server.domain.name)
        .replace(/{domain_filename}/g, config.server.domain.filename)
        .replace(/{entity_title}/g, config.entityTitle);

    tools.writeFile('/backend/' + config.entityName + '/', config.server.controller.filename, template);

    cb(null, true);
}

function generateDomain(config, cb) {
    console.log('Generating domain...');

    if (config.server.datasource === 'mongodb') {
        var template = tools.readTemplate(backendFolder, 'domain-mongo.js');

        template = template
            .replace(/{model_name}/g, config.server.model.name)
            .replace(/{model_filename}/g, config.server.model.filename)
            .replace(/{entity_name}/g, config.entityName)
            .replace(/{search_fields}/, util.getDomainSearchCriteriaMongo(config))
            .replace(/{update_fields}/, util.getDomainUpdateFieldsMongo(config));
    } else if (config.server.datasource === 'mysql') {
        var template = tools.readTemplate(backendFolder, 'domain-mysql.js');

        template = template
            .replace(/{table_name}/g, config.entityName)
            .replace(/{search_fields}/, util.getDomainSearchCriteriaMySql(config))
            .replace(/{insert_fields}/, util.getDomainInsertFieldsMySql(config))
            .replace(/{insert_values}/, util.getDomainInsertFieldParamsMySql(config))
            .replace(/{update_fields}/, util.getDomainUpdateFieldsMySql(config))
            .replace(/{update_params}/, util.getDomainUpdateFieldParamsMySql(config));
    }

    tools.writeFile('/backend/' + config.entityName + '/', config.server.domain.filename, template);

    cb(null, true);
}

function generateMiddleware(config, cb) {
    console.log('Generating middleware...');

    var template = tools.readTemplate(backendFolder, 'middleware.js');

    template = template
        .replace(/{model_name}/g, config.server.model.name)
        .replace(/{model_filename}/g, config.server.model.filename)
        //.replace(/{model_name}/g, config.server.model.name)
        .replace(/{field_required}/g, util.getMiddlewareRequiredFunctions(config))
        .replace(/{field_exists}/g, util.getMiddlewareUniqueFunctions(config))
        .replace(/{exposed_validations}/g, util.getMiddlewareExposedFunctions(config));

    tools.writeFile('/backend/' + config.entityName + '/', config.server.middleware.filename, template);

    cb(null, true);
}

function generateRoute(config, cb) {
    console.log('Generating route...');

    var template = tools.readTemplate(backendFolder, 'route.js');

    template = template
        .replace(/{entity_plural_name}/g, config.entityPluralName)
        .replace(/{controller_name}/g, config.server.controller.name)
        .replace(/{controller_filename}/g, config.server.controller.filename)
        .replace(/{middleware_filename}/g, config.server.middleware.filename)
        .replace(/{validation_require}/g, util.getRouteValidationDeclaration(config))
        .replace(/{required_middleware}/g, util.getRouteRequiredMiddleware(config))
        .replace(/{unique_middleware}/g, util.getRouteUniqueMiddleware(config));

    tools.writeFile('/backend/' + config.entityName + '/', config.server.route.filename, template);

    cb(null, true);
}

module.exports = {
    generateModel: generateModel,
    generateController: generateController,
    generateDomain: generateDomain,
    generateMiddleware: generateMiddleware,
    generateRoute: generateRoute
};