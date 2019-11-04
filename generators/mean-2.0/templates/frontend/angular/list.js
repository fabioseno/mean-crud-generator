import { Component, OnInit } from '@angular/core';

import { ListPageBaseComponent, BackofficeService, StatesData } from '../../../../';

@Component({
    selector: 'page-{entity_plural_name}',
    styleUrls: ['./{entity_plural_name}.component.scss'],
    templateUrl: './{entity_plural_name}.component.html'
})

export class FederationsComponent extends ListPageBaseComponent implements OnInit {

    public gridColumns = ['name', 'state'];
    public states = StatesData.get();
    public filter: any = {
        state: ''
    };

    constructor(private backofficeService: BackofficeService) {
        super();

        this.setPageConfig({
            addRoute: '/backoffice/operacao/federacoes/novo',
            editRoute: '/backoffice/operacao/federacoes'
        });
    }

    listFederations(resetPage = false) {
        if (resetPage) {
            this.resetPage();
        }

        var params = this.getGridParams();

        this.addFilterParam(params, 'state', this.filter.state);

        this.backofficeService.federations.list(params)
            .subscribe(result => {
                if (result.success) {
                    this.setDataSource(result);
                }
            });
    }

    ngOnInit(): void {
        this.listFederations();
    }

}