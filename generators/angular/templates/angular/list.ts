import { Component, OnInit } from '@angular/core';

import { ListPageBaseComponent, BackofficeService, {model_name}Service } from '../../../../';

@Component({
    selector: 'page-{entity_plural_name}',
    styleUrls: ['./{entity_plural_name}.component.scss'],
    templateUrl: './{entity_plural_name}.component.html'
})

export class {model_plural_name}Component extends ListPageBaseComponent implements OnInit {

    public gridColumns = {grid_columns};
    public filter: any = {};

    constructor(private {entity_name}Service: {model_name}Service) {
        super();

        this.setPageConfig({
            addRoute: '/backoffice/{entity_plural_title}/novo',
            editRoute: '/backoffice/{entity_plural_title}'
        });
    }

    buildParams(resetPage = false) {
        if (resetPage) {
            this.resetPage();
        }

        var params = this.getGridParams();

{filter_params}
        return params;
    }

    list{model_plural_name}(resetPage = false) {
        var filter = this.buildParams(resetPage);

        this.{entity_name}Service.{entity_plural_name}.list(filter)
            .subscribe(result => {
                if (result.success) {
                    this.setDataSource(result);
                }
            });
    }

    ngOnInit(): void {
        this.list{model_plural_name}();
    }

}