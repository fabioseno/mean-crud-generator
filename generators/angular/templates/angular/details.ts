import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { PageBaseComponent, Actions, BackofficeService } from '../../../';

@Component({
    selector: 'page-{entity_name}',
    styleUrls: ['./{entity_name}.component.scss'],
    templateUrl: './{entity_name}.component.html'
})

export class {model_name}Component extends PageBaseComponent implements OnInit {

    @ViewChild('form', { static: true }) form: FormGroup;

    public saveButtonPermission;
    public {entity_name}: any = {};

    constructor(private route: ActivatedRoute,
        private backofficeService: BackofficeService) {
        super();

        this.setPageConfig({
            addPermission: '{entity_name_upper}.ADD',
            updatePermission: '{entity_name_upper}.UPDATE'
        });
    }

    loadParams() {
        this.route.params.subscribe(params => {
            if (params.{entity_name}Id !== 'novo') {
                this.setEntityId(params.id);
                this.{entity_name}.id = params.id;

                this.loadDetails();
            }
        });
    }

    loadDetails() {
        if (this.{entity_name}.id) {
            this.backofficeService.{entity_plural_name}.get(this.{entity_name}.id)
                .subscribe(result => {
                    if (result.success) {
                        this.{entity_name} = result.data;
                    }
                });
        }
    }

    saveItem() {
        if (!this.form.invalid) {
            if (this.isNew()) {
                this.createItem();
            } else {
                this.updateItem();
            }
        }
    }

    private createItem() {
        this.execute(!this.form.invalid, Actions.{entity_name}.create, () => {
            this.backofficeService.{entity_plural_name}.add(this.{entity_name})
                .subscribe(result => {
                    if (result.success) {
                        this.toaster.show(result);
                        this.route.navigate([this.getModuleFragment(), '{entity_plural_name}, result.data.id]);
                    }
                });
        });
    }

    private updateItem() {
        this.execute(!this.form.invalid, Actions.{entity_name}.update, () => {
            this.backofficeService.{entity_plural_name}.update(this.{entity_name}.id, this.{entity_name})
                .subscribe(result => {
                    if (result.success) {
                        this.toaster.show(result);
                    }
                });
        });
    }

    deleteItem() {
        this.execute(!this.isNew(), Actions.{entity_name}.remove, () => {
            this.backofficeService.{entity_plural_name}.remove(this.{entity_name}.id)
                .subscribe(result => {
                    if (result.success) {
                        this.toaster.show(result);
                        this.goBack();
                    }
                });
        });
    }

    ngOnInit(): void {
        this.loadParams();
    }

}