var tools = require('./tools');
var backendFolder = 'nodejs';

function generateModel(config, cb) {
    console.log('Generating model...');
    
    var template = tools.readTemplate(backendFolder, 'model.js');

    cb(null, true);
}

function generateController(config, cb) {
    console.log('Generating controller...');

    var template = tools.readTemplate(backendFolder, 'controller.js');

    template = template.replace(/{entityName}/g, config.entity);
    template = template.replace(/{modelName}/g, config.modelName);
    template = template.replace(/{pluralEntityName}/g, config.pluralName);

    tools.writeFile(config.entity + 'Controller.js', template);

    cb(null, true);
}

function generateRoute(config, cb) {
    console.log('Generating route...');

    var template = tools.readTemplate(backendFolder, 'route.js');

    template = template.replace(/{entityName}/g, config.entity);
    template = template.replace(/{pluralEntityName}/g, config.pluralName);
    template = template.replace(/{controllerName}/g, config.controllerName);

    tools.writeFile(config.entity + 'Route.js', template);

    cb(null, true);
}

module.exports = {
    generateModel: generateModel,
    generateController: generateController,
    generateRoute: generateRoute
};