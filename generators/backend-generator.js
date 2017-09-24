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

    cb(null, true);
}

function generateRoute(config, cb) {
    console.log('Generating route...');

    var template = tools.readTemplate(backendFolder, 'route.js');

    cb(null, true);
}

module.exports = {
    generateModel: generateModel,
    generateController: generateController,
    generateRoute: generateRoute
};