var format = require('../tools/format');
var os = require('os');

function getListViewHTMLSearchFields(config) {
    var listingFieldsOutput = '';
    var searchFieldFound = config.fields.find(function (item) {
        return item.searchField;
    });

    if (searchFieldFound) {
        listingFieldsOutput += format.setTabs(2) + format.formatText('<mat-card class="card-block">') + os.EOL;
        listingFieldsOutput += format.setTabs(3) + format.formatText('<form (ngSubmit)="list{0}(true)" novalidate autocomplete="off">', config.server.model.pluralName) + os.EOL;
        listingFieldsOutput += format.setTabs(4) + '<div class="row">' + os.EOL;
    }

    for (i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        if (field.searchField) {
            listingFieldsOutput += format.setTabs(5) + '<div class="col-md-3">' + os.EOL;

            switch (field.controlType) {
                case 'text':
                    listingFieldsOutput += format.setTabs(6) + '<mat-form-field appearance="standard" class="w-100">' + os.EOL;
                    listingFieldsOutput += format.setTabs(7) + format.formatText('<mat-label>{0}</mat-label>', field.fieldLabel) + os.EOL;
                    listingFieldsOutput += format.setTabs(7) + format.formatText('<input matInput name="{0}" [(ngModel)]="filter.{0}">', field.fieldName) + os.EOL;
                    listingFieldsOutput += format.setTabs(6) + '</mat-form-field>' + os.EOL;
                    break;
                case 'dropdown':
                    listingFieldsOutput += format.setTabs(6) + '<mat-form-field appearance="standard" class="w-100">' + os.EOL;
                    listingFieldsOutput += format.setTabs(7) + format.formatText('<mat-label>{0}</mat-label>', field.fieldLabel) + os.EOL;
                    listingFieldsOutput += format.setTabs(7) + format.formatText('<mat-select name="{0}" [(ngModel)]="filter.{0}">', field.fieldName) + os.EOL;
                    listingFieldsOutput += format.setTabs(8) + '<mat-option value="">Todos</mat-option>' + os.EOL;
                    listingFieldsOutput += format.setTabs(8) + format.formatText('<mat-option *ngFor="let {0} of {0}s" [value]="{0}.id">', field.fieldName) + os.EOL;
                    listingFieldsOutput += format.setTabs(9) + format.formatText('{{{0}.description}}', field.fieldName) + os.EOL;
                    listingFieldsOutput += format.setTabs(8) + '</mat-option>' + os.EOL;
                    listingFieldsOutput += format.setTabs(7) + '</mat-select>' + os.EOL;
                    listingFieldsOutput += format.setTabs(6) + '</mat-form-field>' + os.EOL;
                    break;
                default:
                    listingFieldsOutput += format.setTabs(6) + '<mat-form-field appearance="standard" class="w-100">' + os.EOL;
                    listingFieldsOutput += format.setTabs(7) + format.formatText('<mat-label>{0}</mat-label>', field.fieldLabel) + os.EOL;
                    listingFieldsOutput += format.setTabs(7) + format.formatText('<input matInput name="{0}" [(ngModel)]="filter.{0}">', field.fieldName) + os.EOL;
                    listingFieldsOutput += format.setTabs(6) + '</mat-form-field>' + os.EOL;
                    break;
            }

            listingFieldsOutput += format.setTabs(5) + '</div>' + os.EOL;
        }
    }

    if (searchFieldFound) {
        listingFieldsOutput += format.setTabs(4) + '</div>' + os.EOL;
        listingFieldsOutput += format.setTabs(4) + '<div class="row">' + os.EOL;
        listingFieldsOutput += format.setTabs(5) + '<div class="col-md-12">' + os.EOL;

        if (config.fields.filter(item => item.searchField).length > 0) {
            listingFieldsOutput += format.setTabs(6) + '<button mat-raised-button type="button" color="warn" class="btn-w-md" (click)="clearFilter()">Limpar</button>' + os.EOL;
            listingFieldsOutput += format.setTabs(6) + '<span class="space"></span>' + os.EOL;
        }

        listingFieldsOutput += format.setTabs(6) + '<button mat-raised-button type="submit" color="primary" class="btn-w-md">Filtrar</button>' + os.EOL;
        listingFieldsOutput += format.setTabs(5) + '</div>' + os.EOL;
        listingFieldsOutput += format.setTabs(4) + '</div>' + os.EOL;
        listingFieldsOutput += format.setTabs(3) + '</form>' + os.EOL;
        listingFieldsOutput += format.setTabs(2) + '</mat-card>';
    }

    return listingFieldsOutput;
}

function getListViewHTMLGridColumns(config) {
    var listingFieldsOutput = '';
    var columns = [];

    for (i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        columns.push(format.formatText('\'{0}\'', field.fieldName));
    }

    listingFieldsOutput = format.formatText('[{0}]', columns.join(', '));

    return listingFieldsOutput;
}

function getListViewHTMLGridRow(config) {
    var listingFieldsOutput = '';

    for (i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];
        listingFieldsOutput += format.setTabs(4) + format.formatText('<ng-container matColumnDef="{0}">', field.fieldName) + os.EOL;
        listingFieldsOutput += format.setTabs(5) + format.formatText('<th mat-header-cell *matHeaderCellDef>{0}</th>', field.fieldLabel) + os.EOL;
        listingFieldsOutput += format.setTabs(5) + format.formatText('<td mat-cell *matCellDef="let row">{{ row.{0} }}</td>>', field.fieldName) + os.EOL;
        listingFieldsOutput += format.setTabs(4) + '</ng-container>' + os.EOL;
    }

    return listingFieldsOutput;
}

function getListViewFilterParams(config) {
    var listingFieldsOutput = '';

    config.fields.filter(item => item.searchField).forEach(field => {
        listingFieldsOutput += format.setTabs(2) + format.formatText('this.addFilterParam(params, \'{0}\', this.filter.{0});', field.fieldName) + os.EOL;
    });

    listingFieldsOutput += os.EOL;

    listingFieldsOutput += format.setTabs(2) + format.formatText('this.saveFilterPreferences(PageID.{0}, params);', config.server.model.pluralName) + os.EOL;

    return listingFieldsOutput;
}

function getListViewFilterInit(config) {
    let ouput = '';

    if (config.fields.filter(item => item.searchField).length > 0) {
        ouput += format.setTabs(1) + 'initFilter() {' + os.EOL;
        ouput += format.setTabs(2) + 'this.filter = {};' + os.EOL;
        ouput += format.setTabs(1) + '}' + os.EOL;
    }

    return ouput;
}

function getListViewFilterRecover(config) {
    let ouput = '';
    let filters = config.fields.filter(item => item.searchField);

    if (filters.length > 0) {
        ouput += format.setTabs(1) + 'recoverParams() {' + os.EOL;
        ouput += format.setTabs(2) + format.formatText('let params = this.recoverFilterPreferences(PageID.{0});', config.server.model.pluralName) + os.EOL + os.EOL;
        ouput += format.setTabs(2) + 'this.getPagingParams(this.filter, params);' + os.EOL + os.EOL;

        for (let i = 0; i < filters.length; i++) {
            let field = filters[i];

            ouput += format.setTabs(2) + format.formatText('this.getFilterParam(this.filter, \'{0}\', params.{0});', field.fieldName) + os.EOL;
        }

        ouput += format.setTabs(1) + '}' + os.EOL;
    }

    return ouput;
}

function getListViewFilterClear(config) {
    let ouput = '';

    if (config.fields.filter(item => item.searchField).length > 0) {

        ouput += format.setTabs(1) + 'clearFilter() {' + os.EOL;
        ouput += format.setTabs(2) + 'this.initFilter();' + os.EOL;
        ouput += format.setTabs(2) + format.formatText('this.list{0}(true);', config.server.model.pluralName) + os.EOL;
        ouput += format.setTabs(1) + '}' + os.EOL;
    }

    return ouput;
}

function getListViewFilterSetup(config) {
    let ouput = '';

    if (config.fields.filter(item => item.searchField).length > 0) {
        ouput += format.setTabs(2) + 'this.initFilter();' + os.EOL;
        ouput += format.setTabs(2) + 'this.recoverParams();' + os.EOL;
    }

    return ouput;
}

function getDetailsViewHTMLFields(config) {
    var controls = '';

    let maxRows = config.fields.reduce((result, item) => {
        if (item.formRow > result) {
            result = item.formRow;
        }

        return result;
    }, 1);

    for (let i = 1; i <= maxRows; i++) {
        let fields = config.fields.filter(item => item.formRow === i && item.detailsView);

        for (let j = 0; j < fields.length; j++) {
            var field = fields[j];
        }
    }

    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        var required = field.required ? 'required ' : '';
        let tel = field.controlType === 'tel' ? 'type="text" ' : '';
        let currency = field.controlType === 'currency' ? ' currencyMask min="0"' : '';
        let colSize = field.formColSize === 12 ? 'col-12' : 'col-md-' + field.formColSize;
        let checkboxClass = field.controlType === 'checkbox' ? ' checkbox-middle' : '';
        let maxlength = field.maxlength ? 'maxlength="' + field.maxlength + '" ' : '';

        controls += format.setTabs(5) + '<div class="form-group row">' + os.EOL;
        controls += format.setTabs(6) + format.formatText('<div class="{0}"{1}>', colSize, checkboxClass) + os.EOL;
        controls += format.setTabs(7) + '<mat-form-field class="w-100">' + os.EOL;

        switch (field.controlType) {
            case 'text':
            case 'tel':
            case 'currency':
                controls += format.setTabs(8) + format.formatText('<mat-label>{0}</mat-label>', field.fieldLabel) + os.EOL;
                controls += format.setTabs(8) + format.formatText('<input matInput {2}name="{0}" {1}{5}[(ngModel)]="{3}.{0}"{4}>', field.fieldName, required, tel, config.entityName, currency, maxlength) + os.EOL;
                break;
            case 'checkbox':
                controls += format.setTabs(8) + format.formatText('<mat-checkbox name="{0}" color="primary" [(ngModel)]="{1}.{0}">{2}</mat-checkbox>', field.fieldName, config.entityName, field.fieldLabel) + os.EOL;
                break;
            case 'calendar':
                break;
            case 'textarea':
                controls += format.setTabs(8) + format.formatText('<mat-label>{0}</mat-label>', field.fieldLabel) + os.EOL;
                controls += format.setTabs(8) + format.formatText('<textarea matInput name="{0}" rows="4" {2}{3}[(ngModel)]="{1}.{0}"></textarea>', field.fieldName, config.entityName, required, maxlength) + os.EOL;
                break;
        }

        controls += format.setTabs(7) + '</mat-form-field>' + os.EOL;
        controls += format.setTabs(6) + '</div>' + os.EOL;
        controls += format.setTabs(5) + '</div>' + os.EOL;
    }

    return controls;
}

module.exports = {
    getListViewHTMLSearchFields,
    getListViewHTMLGridColumns,
    getListViewHTMLGridRow,
    getListViewFilterParams,
    getListViewFilterInit,
    getListViewFilterRecover,
    getListViewFilterClear,
    getListViewFilterSetup,

    getDetailsViewHTMLFields
};