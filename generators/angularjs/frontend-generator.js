var file = require('../tools/file');
var format = require('../tools/format');
var util = require('./util');
var templatesFolder = __dirname + '/templates/angularjs/';

function writeFile(config, filename, fileContent) {
    return file.writeFile(config.sourcePath, '/frontend/' + config.entityName + '/pages/', filename, fileContent);
}

function generateListViewHtml(config) {
    var template = file.readTemplate(templatesFolder, 'list.html');

    template = template.replace(/{list_view_page_title}/g, config.pages.listViewPageTitle);
    template = template.replace(/{grid_header}/g, util.getListViewHTMLGridHeader(config));
    template = template.replace(/{entity_name}/g, config.entityName);
    template = template.replace(/{model_name}/g, config.model.name);
    template = template.replace(/{entity_plural_name}/g, config.entityPluralName);
    template = template.replace(/{model_plural_name}/g, format.capitalize(config.entityName) + 's');
    template = template.replace(/{grid_rows}/g, util.getListViewHTMLGridRow(config));

    let filePath = writeFile(config, config.pages.listViewHtmlPageFilename, template);

    console.log('List view HTML - OK (' + filePath + ')');
}

function generateListViewLogic(config) {
    var template = file.readTemplate(templatesFolder, 'list.js');

    template = template.replace(/{entity_name}/g, config.entityName);
    template = template.replace(/{model_name}/g, config.model.name);
    template = template.replace(/{entity_plural_name}/g, config.entityPluralName);
    template = template.replace(/{model_plural_name}/g, config.model.pluralName);

    let filePath = writeFile(config, config.pages.listViewJSPageFilename, template);

    console.log('List view logic - OK (' + filePath + ')');
}

function generateDetailsViewHtml(config) {
    var template = file.readTemplate(templatesFolder, 'details.html');

    template = template.replace(/{details_view_page_title}/g, config.pages.detailsViewPageTitle);
    template = template.replace(/{model_name}/g, config.model.name);
    template = template.replace(/{controls}/g, util.getDetailsViewHTMLFields(config));

    let filePath = writeFile(config, config.pages.detailsViewHtmlPageFilename, template);

    console.log('Details view HTML - OK (' + filePath + ')');
}

function generateDetailsViewLogic(config) {
    var template = file.readTemplate(templatesFolder, 'details.js');

    template = template.replace(/{entity_name}/g, config.entityName);
    template = template.replace(/{model_name}/g, config.model.name);
    template = template.replace(/{plural_name}/g, config.model.pluralName);
    template = template.replace(/{entity_title}/g, config.entityTitle);
    template = template.replace(/{entity_plural_title}/g, config.entityPluralTitle);
    template = template.replace(/{details_view_page_title}/g, config.pages.detailsViewPageTitle);
    template = template.replace(/{list_view_js_page_controller_name}/g, config.pages.listViewJSPageControllerName);

    let filePath = writeFile(config, config.pages.detailsViewJSPageFilename, template);

    console.log('Details view logic - OK (' + filePath + ')');
}

function generateUIRoutes(config) {
    var template = file.readTemplate(templatesFolder, 'router.js');

    template = template.replace(/{entity_name}/g, config.entityName);
    template = template.replace(/{entity_plural_name}/g, config.entityPluralName);
    template = template.replace(/{list_view_html_filename}/g, config.pages.listViewHtmlPageFilename);
    template = template.replace(/{list_view_js_controller_name}/g, config.pages.listViewJSPageControllerName);
    template = template.replace(/{details_view_html_filename}/g, config.pages.detailsViewHtmlPageFilename);
    template = template.replace(/{details_view_js_controller_name}/g, config.pages.detailsViewJSPageControllerName);

    let filePath = writeFile(config, config.entityName + '-router.js', template);

    console.log('UI routes - OK (' + filePath + ')');
}

module.exports = {
    generateListViewHtml,
    generateListViewLogic,
    generateDetailsViewHtml,
    generateDetailsViewLogic,
    generateUIRoutes
};