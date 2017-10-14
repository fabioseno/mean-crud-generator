var tools = require('./tools');
var util = require('./util');
var frontendFolder = 'angularjs';

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function generateListViewHtml(config, cb) {
    console.log('Generating list view HTML...');

    var template = tools.readTemplate(frontendFolder, 'list.html');

    template = template.replace(/{list_view_page_title}/g, config.pages.listViewPageTitle);
    template = template.replace(/{grid_header}/g, util.getListViewHTMLGridHeader(config));
    template = template.replace(/{entity_name}/g, config.entityName);
    template = template.replace(/{model_name}/g, config.model.name);
    template = template.replace(/{plural_name}/g, config.model.pluralName);
    template = template.replace(/{model_plural_name}/g, capitalize(config.entityName) + 's');
    template = template.replace(/{grid_rows}/g, util.getListViewHTMLGridRow(config));

    tools.writeFile('/pages/' + config.entityName + '-list.html', template);

    cb(null, true);
}

function generateListViewLogic(config, cb) {
    console.log('Generating list view logic...');

    var template = tools.readTemplate(frontendFolder, 'list.js');

    template = template.replace(/{entity_name}/g, config.entityName);
    template = template.replace(/{model_name}/g, config.model.name);
    template = template.replace(/{entity_plural_name}/g, config.model.pluralName);
    template = template.replace(/{model_plural_name}/g, config.model.pluralName);

    tools.writeFile('/pages/' + config.entityName + '-list.js', template);

    cb(null, true);
}

function generateDetailsViewHtml(config, cb) {
    console.log('Generating details view HTML...');

    var template = tools.readTemplate(frontendFolder, 'details.html');

    template = template.replace(/{details_view_page_title}/g, config.pages.detailsViewPageTitle);
    template = template.replace(/{model_name}/g, config.model.name);
    template = template.replace(/{controls}/g, util.getDetailsViewHTMLFields(config));

    tools.writeFile('/pages/' + config.entityName + '-details.html', template);

    cb(null, true);
}

function generateDetailsViewLogic(config, cb) {
    console.log('Generating details view logic...');

    var template = tools.readTemplate(frontendFolder, 'details.js');

    template = template.replace(/{entity_name}/g, config.entityName);
    template = template.replace(/{model_name}/g, config.model.name);
    template = template.replace(/{plural_name}/g, config.model.pluralName);
    template = template.replace(/{entity_title}/g, config.entityTitle);
    template = template.replace(/{entity_plural_title}/g, config.entityPluralTitle);
    template = template.replace(/{details_view_page_title}/g, config.pages.detailsViewPageTitle);

    tools.writeFile('/pages/' + config.entityName + '-details.js', template);

    cb(null, true);
}

function generateUIRoutes(config, cb) {
    console.log('Generating ui routes...');

    var template = tools.readTemplate(frontendFolder, 'router.js');

    template = template.replace(/{entity_name}/g, config.entityName);
    template = template.replace(/{entity_plural_name}/g, config.entityPluralName);
    template = template.replace(/{list_view_html_filename}/g, config.pages.listViewHtmlPageFilename);
    template = template.replace(/{list_view_js_controller_name}/g, config.pages.listViewJSPageControllerName);
    template = template.replace(/{details_view_html_filename}/g, config.pages.detailsViewHtmlPageFilename);
    template = template.replace(/{details_view_js_controller_name}/g, config.pages.detailsViewJSPageControllerName);

    tools.writeFile('/config/' + config.entityName + '-router.js', template);

    cb(null, true);
}

module.exports = {
    generateListViewHtml: generateListViewHtml,
    generateListViewLogic: generateListViewLogic,
    generateDetailsViewHtml: generateDetailsViewHtml,
    generateDetailsViewLogic: generateDetailsViewLogic
};