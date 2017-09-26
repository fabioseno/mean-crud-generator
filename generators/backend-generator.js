var tools = require('./tools');
var backendFolder = 'nodejs';

function generateModel(config, cb) {
    console.log('Generating model...');
    
    var template = tools.readTemplate(backendFolder, 'model.js');

    var result = '';
    var obj = {};

    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];
        
        obj[field.fieldName] = {
            type: field.dataType
        }

        if (field.unique) {
            obj[field.fieldName].unique = true;
        }
    }

    template = template.replace(/{entityModelSchema}/g, config.model.schemaName);
    template = template.replace(/{fields}/g, JSON.stringify(obj, null, '\t'));

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

module.exports = {
    generateModel: generateModel,
    generateController: generateController,
    generateRoute: generateRoute
};