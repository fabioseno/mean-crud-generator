import { Component, OnInit } from '@angular/core';

import { ListPageBaseComponent, PageID, BackofficeService } from '../../../';

@Component({
    selector: 'page-{entity_plural_name}',
    styleUrls: ['./{entity_plural_name}.component.scss'],
    templateUrl: './{entity_plural_name}.component.html'
})

export class {model_plural_name}Component extends ListPageBaseComponent implements OnInit {

    public gridColumns = {grid_columns};
    public filter: any = {};

    constructor(private backofficeService: BackofficeService) {
        super();

        this.setPageConfig({
            addRoute: [this.getModuleFragment(), '{entity_plural_name}', 'novo'],
            editRoute: [this.getModuleFragment(), '{entity_plural_name}']
        });
    }

{filter_init}
    buildParams(resetPage = false) {
        if (resetPage) {
            this.resetPage();
        }

        var params = this.getGridParams();

{filter_params}
        return params;
    }

{filter_recover}
{filter_clear}
    list{model_plural_name}(resetPage = false) {
        var filter = this.buildParams(resetPage);

        this.backofficeService.{entity_plural_name}.list(filter)
            .subscribe(result => {
                if (result.success) {
                    this.setDataSource(result);
                }
            });
    }

    ngOnInit(): void {
{filter_setup}
        this.list{model_plural_name}();
    }

}