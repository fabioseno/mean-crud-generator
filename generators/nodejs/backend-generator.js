var file = require('../tools/file');
var util = require('./util');
var templateFolder = __dirname + '/templates';

function writeFile(config, filename, fileContent) {
    return file.writeFile(config.sourcePath, '/backend/' + config.entityName, filename, fileContent);
}

function generateModel(config) {
    var template = file.readTemplate(templateFolder, 'model.js');

    template = template
        .replace(/{entity_model_schema}/g, config.server.model.schemaName)
        .replace(/{fields}/g, util.getModelMetadata(config))
        .replace(/{model_name}/g, config.server.model.name);

    let filePath = writeFile(config, config.server.model.filename, template);

    console.log('Model - OK (' + filePath + ')');
}

function generateControllerMongo(config) {
    var template = file.readTemplate(templateFolder, 'controller-mongo.js');

    template = template
        .replace(/{entity_name}/g, config.entityName)
        .replace(/{entity_plural_name}/g, config.entityPluralName)
        .replace(/{domain_name}/g, config.server.domain.name)
        .replace(/{domain_filename}/g, config.server.domain.filename)
        .replace(/{entity_title}/g, config.entityTitle);

    let filePath = writeFile(config, config.server.controller.filename, template);

    console.log('Controller - OK (' + filePath + ')');
}

function generateControllerMySQL(config) {
    var template = file.readTemplate(templateFolder, 'controller-mysql.js');

    template = template
        .replace(/{entity_name}/g, config.entityName)
        .replace(/{entity_plural_name}/g, config.entityPluralName)
        .replace(/{domain_name}/g, config.server.domain.name)
        .replace(/{domain_filename}/g, config.server.domain.filename)
        .replace(/{entity_title}/g, config.entityTitle);

    let filePath = writeFile(config, config.server.controller.filename, template);

    console.log('Controller - OK (' + filePath + ')');
}

function generateDomainMySQL(config) {
    var template = file.readTemplate(templateFolder, 'domain-mysql.js');

    template = template
        .replace(/{table_name}/g, config.entityName)
        .replace(/{entity_title}/g, config.entityTitle)
        .replace(/{entity_name}/g, config.entityName)
        .replace(/{search_fields}/, util.getDomainSearchCriteriaMySql(config))
        .replace(/{insert_fields}/, util.getDomainInsertFieldsMySql(config))
        .replace(/{insert_values}/, util.getDomainInsertFieldParamsMySql(config))
        .replace(/{update_fields}/, util.getDomainUpdateFieldsMySql(config))
        .replace(/{update_params}/, util.getDomainUpdateFieldParamsMySql(config))
        .replace(/{order_by_fields}/g, util.getDomainOrderByFieldsMySql(config));

    let filePath = writeFile(config, config.server.domain.filename, template);

    console.log('Domain - OK (' + filePath + ')');
}

function generateDomainMongoDB(config) {
    var template = file.readTemplate(templateFolder, 'domain-mongo.js');

    template = template
        .replace(/{model_name}/g, config.server.model.name)
        .replace(/{model_filename}/g, config.server.model.filename)
        .replace(/{entity_name}/g, config.entityName)
        .replace(/{search_fields}/, util.getDomainSearchCriteriaMongo(config))
        .replace(/{update_fields}/, util.getDomainUpdateFieldsMongo(config));

    let filePath = writeFile(config, config.server.domain.filename, template);

    console.log('Domain - OK (' + filePath + ')');
}

function generateMiddleware(config) {
    var template = file.readTemplate(templateFolder, 'middleware.js');

    template = template
        .replace(/{model_import}/g, '')
        .replace(/{model_name}/g, config.server.model.name)
        .replace(/{model_filename}/g, config.server.model.filename)
        .replace(/{field_required}/g, util.getMiddlewareRequiredFunctions(config))
        .replace(/{field_exists}/g, util.getMiddlewareUniqueFunctions(config))
        .replace(/{exposed_validations}/g, util.getMiddlewareExposedFunctions(config));

    let filePath = writeFile(config, config.server.middleware.filename, template);

    console.log('Middleware - OK (' + filePath + ')');
}

function generateRoute(config) {
    var template = file.readTemplate(templateFolder, 'route.js');

    template = template
        .replace(/{entity_name_upper}/g, config.entityName.toUpperCase())
        .replace(/{entity_plural_name}/g, config.entityPluralName)
        .replace(/{controller_name}/g, config.server.controller.name)
        .replace(/{controller_filename}/g, config.server.controller.filename)
        .replace(/{middleware_filename}/g, config.server.middleware.filename)
        .replace(/{validation_require}/g, util.getRouteValidationDeclaration(config))
        .replace(/{required_middleware}/g, util.getRouteRequiredMiddleware(config))
        .replace(/{unique_middleware}/g, util.getRouteUniqueMiddleware(config));

    let filePath = writeFile(config, config.server.route.filename, template);

    console.log('Route - OK (' + filePath + ')');
}

function generateIndex(config) {
    var template = file.readTemplate(templateFolder, 'index.js');

    template = template
        .replace(/{entity_name}/g, config.entityName);

    let filePath = writeFile(config, 'index.js', template);

    console.log('Index - OK (' + filePath + ')');
}

module.exports = {
    generateModel,
    generateControllerMongo,
    generateControllerMySQL,
    generateDomainMySQL,
    generateDomainMongoDB,
    generateMiddleware,
    generateRoute,
    generateIndex
};