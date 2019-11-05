import { Component, OnInit } from '@angular/core';

import { ListPageBaseComponent, BackofficeService, StatesData } from '../../../../';

@Component({
    selector: 'page-{entity_plural_name}',
    styleUrls: ['./{entity_plural_name}.component.scss'],
    templateUrl: './{entity_plural_name}.component.html'
})

export class {model_plural_name}Component extends ListPageBaseComponent implements OnInit {

    public gridColumns = {grid_columns};
    public states = StatesData.get();
    public filter: any = {
        state: ''
    };

    constructor(private backofficeService: BackofficeService) {
        super();

        this.setPageConfig({
            addRoute: '/backoffice/operacao/{entity_plural_title}/novo',
            editRoute: '/backoffice/operacao/{entity_plural_title}'
        });
    }

    list{model_plural_name}(resetPage = false) {
        if (resetPage) {
            this.resetPage();
        }

        var params = this.getGridParams();
        
{filter_params}
        this.backofficeService.{entity_plural_name}.list(params)
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