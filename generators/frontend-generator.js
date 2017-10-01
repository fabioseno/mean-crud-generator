var tools = require('./tools');
var os = require('os');
var frontendFolder = 'angularjs';

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function generateListViewHtml(config, cb) {
    console.log('Generating list view HTML...');

    var template = tools.readTemplate(frontendFolder, 'list.html');

    template = template.replace(/{list_view_page_title}/g, config.pages.listViewPageTitle);

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

    template = template.replace(/{details_view_page_title}/g, config.pages.detailsViewPageTitle);
    template = template.replace(/{model_name}/g, config.model.name);

    var controls = '';
    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        var required = field.required ? 'required' : '';
        var messages = required ? `<div ng-messages="vm.form.` + field.fieldName + `.$error" multiple ng-if="vm.form.$submitted || vm.form.` + field.fieldName + `.$dirty">
            <div ng-message="required">Campo obrigatório</div>
        </div>` : '';
        
        controls += `<div class="form-group col-lg-12">
        <label for="` + field.fieldName + `">` + field.model.name + `</label>
        <input type="text" id="` + field.fieldName + `" name="` + field.fieldName + `" ` + required + ` class="form-control" data-ng-model="vm.` + config.entityName + `.` + field.fieldName + `">
        ` + messages + `
    </div>`;
    }

    template = template.replace(/{controls}/g, controls);

    tools.writeFile('/pages/' + config.entityName + '-details.html', template);

    cb(null, true);
}

function generateDetailsViewLogic(config, cb) {
    console.log('Generating details view logic...');

    var template = tools.readTemplate(frontendFolder, 'details.js');

    template = template.replace(/{entity_name}/g, config.entityName);
    template = template.replace(/{plural_name}/g, config.model.pluralName);
    template = template.replace(/{entity_title}/g, config.entityTitle);
    template = template.replace(/{entity_plural_title}/g, config.entityPluralTitle);

    template = template.replace(/{details_view_page_title}/g, config.pages.detailsViewPageTitle);

    tools.writeFile('/pages/' + config.entityName + '-details.js', template);

    cb(null, true);
}

module.exports = {
    generateListViewHtml: generateListViewHtml,
    generateListViewLogic: generateListViewLogic,
    generateDetailsViewHtml: generateDetailsViewHtml,
    generateDetailsViewLogic: generateDetailsViewLogic
};