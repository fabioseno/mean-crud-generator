var os = require('os');
var frontend = require('./frontend-generator');

function generate(config) {
    frontend.generateListViewHtml(config);
    frontend.generateListViewLogic(config);
    frontend.generateDetailsViewHtml(config);
    frontend.generateDetailsViewLogic(config);
    frontend.generateUIRoutes(config);

    console.log('Finished generating frontend files' + os.EOL);
}

module.exports = {
    generate
};