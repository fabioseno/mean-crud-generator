var os = require('os');
var frontend = require('./frontend-generator');

function generate(config) {
    frontend.generateListViewHtml(config);
    frontend.generateListViewStyle(config);
    frontend.generateListViewLogic(config);
    frontend.generateDetailsViewHtml(config);
    frontend.generateDetailsViewStyle(config);
    frontend.generateDetailsViewLogic(config);
    frontend.generateService(config);
    frontend.generateUIRoutes(config);
    console.log('Finished generating Angular files' + os.EOL);
}

module.exports = {
    generate: generate
};