var tools = require('../tools');
var util = require('./util');
var frontendFolder = __dirname + '/templates/frontend/angular/';

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function generateListViewHtml(config, cb) {
    console.log('Generating list view HTML...');

    var template = tools.readTemplate(frontendFolder, 'list.html');

    template = template
        .replace(/{list_view_page_title}/g, config.web.pages.listViewPageTitle)
        .replace(/{model_plural_name}/g, capitalize(config.entityName) + 's')
        .replace(/{filter_form}/g, util.getListViewHTMLSearchFields(config))
        .replace(/{grid_rows}/g, util.getListViewHTMLGridRow(config));

    tools.writeFile('/frontend/' + config.entityName + '/pages/', config.web.pages.listViewHtmlPageFilename, template);

    cb(null, true);
}

function generateListViewStyle(config, cb) {
    console.log('Generating list view style...');

    tools.writeFile('/frontend/' + config.entityName + '/pages/', config.web.pages.listViewStylePageFilename, '');

    cb(null, true);
}

function generateListViewLogic(config, cb) {
    console.log('Generating list view logic...');

    var template = tools.readTemplate(frontendFolder, 'list.js');

    template = template.replace(/{entity_plural_name}/g, config.entityPluralName);

    template = template
        .replace(/{entity_name}/g, config.entityName)
        .replace(/{entity_plural_title}/g, config.entityPluralTitle)
        .replace(/{model_name}/g, config.server.model.name)
        .replace(/{model_plural_name}/g, config.server.model.pluralName)
        .replace(/{grid_columns}/g, util.getListViewHTMLGridColumns(config))
        .replace(/{filter_params}/g, util.getListViewFilterParams(config));

    tools.writeFile('/frontend/' + config.entityName + '/pages/', config.web.pages.listViewCodePageFilename, template);

    cb(null, true);
}

function generateDetailsViewHtml(config, cb) {
    console.log('Generating details view HTML...');

    var template = tools.readTemplate(frontendFolder, 'details.html');

    template = template
        .replace(/{details_view_page_title}/g, config.web.pages.detailsViewPageTitle)
        .replace(/{controls}/g, util.getDetailsViewHTMLFields(config));

    tools.writeFile('/frontend/' + config.entityName + '/pages/', config.web.pages.detailsViewHtmlPageFilename, template);

    cb(null, true);
}

function generateDetailsViewStyle(config, cb) {
    console.log('Generating details view style...');

    tools.writeFile('/frontend/' + config.entityName + '/pages/', config.web.pages.detailsViewStylePageFilename, '');

    cb(null, true);
}

function generateDetailsViewLogic(config, cb) {
    console.log('Generating details view logic...');

    var template = tools.readTemplate(frontendFolder, 'details.js');

    template = template
        .replace(/{entity_name}/g, config.entityName)
        .replace(/{model_name}/g, config.server.model.name)
        .replace(/{plural_name}/g, config.server.model.pluralName)
        .replace(/{entity_title}/g, config.entityTitle)
        .replace(/{entity_plural_title}/g, config.entityPluralTitle)
        .replace(/{details_view_page_title}/g, config.web.pages.detailsViewPageTitle)
        .replace(/{list_view_js_page_controller_name}/g, config.web.pages.listViewJSPageControllerName);

    tools.writeFile('/frontend/' + config.entityName + '/pages/', config.web.pages.detailsViewCodePageFilename, template);

    cb(null, true);
}

function generateUIRoutes(config, cb) {
    console.log('Generating ui routes...');

    var template = tools.readTemplate(frontendFolder, 'router.js');

    template = template
        .replace(/{entity_name}/g, config.entityName)
        .replace(/{entity_plural_name}/g, config.entityPluralName)
        .replace(/{list_view_html_filename}/g, config.web.pages.listViewHtmlPageFilename)
        .replace(/{list_view_js_controller_name}/g, config.web.pages.listViewJSPageControllerName)
        .replace(/{details_view_html_filename}/g, config.web.pages.detailsViewHtmlPageFilename)
        .replace(/{details_view_js_controller_name}/g, config.web.pages.detailsViewJSPageControllerName);

    tools.writeFile('/frontend/' + config.entityName + '/config/', config.entityName + '-router.js', template);

    cb(null, true);
}

module.exports = {
    generateListViewHtml: generateListViewHtml,
    generateListViewStyle: generateListViewStyle,
    generateListViewLogic: generateListViewLogic,
    generateDetailsViewHtml: generateDetailsViewHtml,
    generateDetailsViewStyle: generateDetailsViewStyle,
    generateDetailsViewLogic: generateDetailsViewLogic,
    generateUIRoutes: generateUIRoutes
};