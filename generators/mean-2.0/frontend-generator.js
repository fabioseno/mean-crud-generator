var tools = require('../tools');
var util = require('./util');
var frontendFolder = __dirname + '/templates/frontend/angular/';

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function generateListViewHtml(config, cb) {
    console.log('Generating list view HTML...');

    var template = tools.readTemplate(frontendFolder, 'list.html');

    template = template.replace(/{list_view_page_title}/g, config.web.pages.listViewPageTitle);

    //template = template.replace(/{grid_header}/g, util.getListViewHTMLGridHeader(config));
    template = template.replace(/{entity_name}/g, config.entityName);
    template = template.replace(/{model_name}/g, config.server.model.name);
    template = template.replace(/{entity_plural_name}/g, config.entityPluralName);
    template = template.replace(/{model_plural_name}/g, capitalize(config.entityName) + 's');
    template = template.replace(/{filter_form}/g, util.getListViewHTMLSearchFields(config));
    
    template = template.replace(/{grid_rows}/g, util.getListViewHTMLGridRow(config));

    tools.writeFile('/frontend/pages/', config.web.pages.listViewHtmlPageFilename, template);

    cb(null, true);
}

function generateListViewLogic(config, cb) {
    console.log('Generating list view logic...');

    var template = tools.readTemplate(frontendFolder, 'list.js');

    template = template.replace(/{entity_plural_name}/g, config.entityPluralName);

    template = template.replace(/{entity_name}/g, config.entityName);
    template = template.replace(/{entity_plural_title}/g, config.entityPluralTitle);
    template = template.replace(/{model_name}/g, config.server.model.name);
    template = template.replace(/{model_plural_name}/g, config.server.model.pluralName);
    template = template.replace(/{grid_columns}/g, util.getListViewHTMLGridColumns(config));
    template = template.replace(/{filter_params}/g, util.getListViewFilterParams(config));
    
    tools.writeFile('/frontend/pages/', config.web.pages.listViewJSPageFilename, template);

    cb(null, true);
}

function generateDetailsViewHtml(config, cb) {
    console.log('Generating details view HTML...');

    var template = tools.readTemplate(frontendFolder, 'details.html');

    template = template.replace(/{details_view_page_title}/g, config.web.pages.detailsViewPageTitle);
    template = template.replace(/{model_name}/g, config.server.model.name);
    template = template.replace(/{controls}/g, util.getDetailsViewHTMLFields(config));

    tools.writeFile('/frontend/pages/', config.web.pages.detailsViewHtmlPageFilename, template);

    cb(null, true);
}

function generateDetailsViewLogic(config, cb) {
    console.log('Generating details view logic...');

    var template = tools.readTemplate(frontendFolder, 'details.js');

    template = template.replace(/{entity_name}/g, config.entityName);
    template = template.replace(/{model_name}/g, config.server.model.name);
    template = template.replace(/{plural_name}/g, config.server.model.pluralName);
    template = template.replace(/{entity_title}/g, config.entityTitle);
    template = template.replace(/{entity_plural_title}/g, config.entityPluralTitle);
    template = template.replace(/{details_view_page_title}/g, config.web.pages.detailsViewPageTitle);
    template = template.replace(/{list_view_js_page_controller_name}/g, config.web.pages.listViewJSPageControllerName);

    tools.writeFile('/frontend/pages/', config.web.pages.detailsViewJSPageFilename, template);

    cb(null, true);
}

function generateUIRoutes(config, cb) {
    console.log('Generating ui routes...');

    var template = tools.readTemplate(frontendFolder, 'router.js');

    template = template.replace(/{entity_name}/g, config.entityName);
    template = template.replace(/{entity_plural_name}/g, config.entityPluralName);
    template = template.replace(/{list_view_html_filename}/g, config.web.pages.listViewHtmlPageFilename);
    template = template.replace(/{list_view_js_controller_name}/g, config.web.pages.listViewJSPageControllerName);
    template = template.replace(/{details_view_html_filename}/g, config.web.pages.detailsViewHtmlPageFilename);
    template = template.replace(/{details_view_js_controller_name}/g, config.web.pages.detailsViewJSPageControllerName);

    tools.writeFile('/frontend/config/', config.entityName + '-router.js', template);

    cb(null, true);
}

module.exports = {
    generateListViewHtml: generateListViewHtml,
    generateListViewLogic: generateListViewLogic,
    generateDetailsViewHtml: generateDetailsViewHtml,
    generateDetailsViewLogic: generateDetailsViewLogic,
    generateUIRoutes: generateUIRoutes
};