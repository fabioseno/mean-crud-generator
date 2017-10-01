var tools = require('./tools');
var os = require('os');
var frontendFolder = 'angularjs';

function capitalize (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function generateListViewHtml(config, cb) {
    console.log('Generating list view HTML...');

    var template = tools.readTemplate(frontendFolder, 'list.html');

    template = template.replace(/{listViewPageTitle}/g, config.pages.listViewPageTitle);

    // Listing Header
    var listingHeaderOutput = '';
    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        listingHeaderOutput += '\t\t\t\t\t\t\t\t\t<th>' + field.fieldLabel + '</th>';

        if (i !== config.fields.length - 1) {
            listingHeaderOutput += os.EOL;
        }
    }

    template = template.replace(/{listing_header}/g, listingHeaderOutput);
    template = template.replace(/{entity_name}/g, config.entityName);
    template = template.replace(/{model_name}/g, config.model.name);
    template = template.replace(/{plural_name}/g, config.model.pluralName);
    template = template.replace(/{model_plural_name}/g, capitalize(config.entityName) + 's');

    // Listing Fields
    var listingFieldsOutput = '';
    for (i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        listingFieldsOutput += '\t\t\t\t\t\t\t\t\t<td data-ng-bind="' + config.entityName + '.' + field.fieldName + '"></td>';

        if (i !== config.fields.length - 1) {
            listingFieldsOutput += os.EOL;
        }
    }

    template = template.replace(/{listing_fields}/g, listingFieldsOutput);
    
    tools.writeFile('/pages/' + config.entityName + '-list.html', template);

    cb(null, true);
}

function generateListViewLogic(config, cb) {
    console.log('Generating list view logic...');

    var template = tools.readTemplate(frontendFolder, 'list.js');

    template = template.replace(/{entity_name}/g, config.entityName);
    template = template.replace(/{model_name}/g, config.model.name);
    template = template.replace(/{plural_name}/g, config.model.pluralName);
    template = template.replace(/{model_plural_name}/g, capitalize(config.entityName) + 's');
    
    tools.writeFile('/pages/' + config.entityName + '-list.js', template);

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