var format = require('../tools/format');
var os = require('os');

function getListViewHTMLGridHeader(config) {
    var listingHeaderOutput = '';

    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        listingHeaderOutput += format.setTabs(9) + '<th>' + field.fieldLabel + '</th>';

        if (i !== config.fields.length - 1) {
            listingHeaderOutput += os.EOL;
        }
    }

    return listingHeaderOutput;
}

function getListViewHTMLGridRow(config) {
    var listingFieldsOutput = '';

    for (i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        listingFieldsOutput += format.setTabs(9) + format.formatText('<td data-ng-bind="{0}.{1}"></td>', config.entityName, field.fieldName);

        if (i !== config.fields.length - 1) {
            listingFieldsOutput += os.EOL;
        }
    }

    return listingFieldsOutput;
}

function getDetailsViewHTMLFields(config) {
    var controls = '';

    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        var required = field.required ? 'required' : '';
        var messages = '';

        if (required) {
            messages += format.setTabs(11) + format.formatText('<div ng-messages="vm.form.{0}.$error" multiple ng-if="vm.form.$submitted || vm.form.{1}.$dirty">', field.fieldName, field.fieldName) + os.EOL;
            messages += format.setTabs(12) + '<div ng-message="required">Campo obrigatório</div>' + os.EOL;
            messages += format.setTabs(11) + '</div>' + os.EOL;
        }
        
        controls += os.EOL;
        controls += format.setTabs(10) + '<div class="form-group col-lg-12">' + os.EOL;
        controls += format.setTabs(11) + format.formatText('<label for="{0}">{1}</label>', field.fieldName, config.model.name) + os.EOL;
        controls += format.setTabs(11) + format.formatText('<input type="text" id="{0}" name="{1}" {2} class="form-control" data-ng-model="vm.{3}.{4}">', field.fieldName, field.fieldName, required, config.entityName, field.fieldName) + os.EOL;
        controls += messages;
        controls += format.setTabs(10) + '</div>';
    }

    return controls;
}

module.exports = {
    getListViewHTMLGridHeader,
    getListViewHTMLGridRow,

    getDetailsViewHTMLFields
};