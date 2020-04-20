var file = require('../tools/file');
var format = require('../tools/format');
var util = require('./util');
var templatesFolder = __dirname + '/templates/angular/';

function writeFile(config, filename, fileContent) {
    return file.writeFile(config.sourcePath, '/frontend/' + config.entityName + '/pages', filename, fileContent);
}

function generateListViewHtml(config) {
    var template = file.readTemplate(templatesFolder, 'list.html');

    template = template
        .replace(/{list_view_page_title}/g, config.web.pages.listViewPageTitle)
        .replace(/{model_plural_name}/g, format.capitalize(config.entityName) + 's')
        .replace(/{filter_form}/g, util.getListViewHTMLSearchFields(config))
        .replace(/{grid_rows}/g, util.getListViewHTMLGridRow(config));

    let filePath = writeFile(config, config.web.pages.listViewHtmlPageFilename, template);

    console.log('List view HTML - OK (' + filePath + ')');
}

function generateListViewStyle(config) {
    let filePath = writeFile(config, config.web.pages.listViewStylePageFilename, '');

    console.log('List view style - OK (' + filePath + ')');
}

function generateListViewLogic(config) {
    var template = file.readTemplate(templatesFolder, 'list.ts');

    template = template
        .replace(/{entity_plural_name}/g, config.entityPluralName)
        .replace(/{entity_name}/g, config.entityName)
        .replace(/{entity_plural_title}/g, config.entityPluralTitle)
        .replace(/{model_name}/g, config.server.model.name)
        .replace(/{model_plural_name}/g, config.server.model.pluralName)
        .replace(/{grid_columns}/g, util.getListViewHTMLGridColumns(config))
        .replace(/{filter_params}/g, util.getListViewFilterParams(config));

    let filePath = writeFile(config, config.web.pages.listViewCodePageFilename, template);

    console.log('List view logic - OK (' + filePath + ')');
}

function generateDetailsViewHtml(config) {
    var template = file.readTemplate(templatesFolder, 'details.html');

    template = template
        .replace(/{details_view_page_title}/g, config.web.pages.detailsViewPageTitle)
        .replace(/{controls}/g, util.getDetailsViewHTMLFields(config));

    let filePath = writeFile(config, config.web.pages.detailsViewHtmlPageFilename, template);

    console.log('Details view html - OK (' + filePath + ')');
}

function generateDetailsViewStyle(config) {
    let filePath = writeFile(config, config.web.pages.detailsViewStylePageFilename, '');

    console.log('Details view style - OK (' + filePath + ')');
}

function generateDetailsViewLogic(config) {
    var template = file.readTemplate(templatesFolder, 'details.ts');

    template = template
        .replace(/{entity_name}/g, config.entityName)
        .replace(/{model_name}/g, config.server.model.name);

    let filePath = writeFile(config, config.web.pages.detailsViewCodePageFilename, template);

    console.log('Details view logic - OK (' + filePath + ')');
}

function generateService(config) {
    var template = file.readTemplate(templatesFolder, 'service.ts');

    template = template
        .replace(/{entity_name}/g, config.entityName)
        .replace(/{model_name}/g, config.server.model.name);

    let filePath = writeFile(config, config.entityName + '.service.ts', template);

    console.log('Service - OK (' + filePath + ')');
}

function generateUIRoutes(config) {
    var template = file.readTemplate(templatesFolder, 'router.ts');

    template = template
        .replace(/{entity_name}/g, config.entityName)
        .replace(/{entity_plural_name}/g, config.entityPluralName)
        .replace(/{list_view_html_filename}/g, config.web.pages.listViewHtmlPageFilename)
        .replace(/{list_view_js_controller_name}/g, config.web.pages.listViewJSPageControllerName)
        .replace(/{details_view_html_filename}/g, config.web.pages.detailsViewHtmlPageFilename)
        .replace(/{details_view_js_controller_name}/g, config.web.pages.detailsViewJSPageControllerName);

    let filePath = writeFile(config, config.entityName + '-router.js', template);

    console.log('UI Routes - OK (' + filePath + ')');
}

module.exports = {
    generateListViewHtml,
    generateListViewStyle,
    generateListViewLogic,
    generateDetailsViewHtml,
    generateDetailsViewStyle,
    generateDetailsViewLogic,
    generateService,
    generateUIRoutes
};