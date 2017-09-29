var tools = require('./tools');
var frontendFolder = 'angularjs';

function generateListViewHtml(config, cb) {
    console.log('Generating list view HTML...');

    var template = tools.readTemplate(frontendFolder, 'list.html');

    template = template.replace(/{listingPageName}/g, config.pages.listingPageName;);
    
    tools.writeFile('/pages/' + config.model.name + '-list.html', template);

    cb(null, true);
}

function generateListViewLogic(config, cb) {
    console.log('Generating list view logic...');

    var template = tools.readTemplate(frontendFolder, 'list.js');

    cb(null, true);
}

function generateDetailsViewHtml(config, cb) {
    console.log('Generating details view HTML...');

    var template = tools.readTemplate(frontendFolder, 'details.html');

    cb(null, true);
}

function generateDetailsViewLogic(config, cb) {
    console.log('Generating details view logic...');

    var template = tools.readTemplate(frontendFolder, 'details.js');

    cb(null, true);
}

module.exports = {
    generateListViewHtml: generateListViewHtml,
    generateListViewLogic: generateListViewLogic,
    generateDetailsViewHtml: generateDetailsViewHtml,
    generateDetailsViewLogic: generateDetailsViewLogic
};