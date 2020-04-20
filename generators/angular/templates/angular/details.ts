import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { PageBaseComponent, ConfirmationMessages, {model_name}Service } from '../../../../../';

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
        private {entity_name}Service: {model_name}Service) {
        super();
    }

    loadParams() {
        this.route.params.subscribe(params => {
            if (params.{entity_name}Id !== 'novo') {
                this.{entity_name}.id = params.{entity_name}Id;
                this.hasId = true;
            }
        });
    }

    loadDetails() {
        if (this.{entity_name}.id) {
            this.{entity_name}Service.get(this.{entity_name}Id, this.{entity_name}.id)
                .subscribe(result => {
                    if (result.success) {
                        this.{entity_name} = result.data;
                    }
                });
        }
    }

    createItem() {
        this.execute(!this.form.invalid, ConfirmationMessages.{entity_name}.create, () => {
            this.{entity_name}Service.add(this.{entity_name})
                .subscribe(result => {
                    if (result.success) {
                        this.toaster.show(result);
                        this.goBack();
                    }
                });
        });
    }

    updateItem() {
        this.execute(!this.form.invalid, ConfirmationMessages.{entity_name}.update, () => {
            this.{entity_name}Service.update(this.{entity_name}.id, this.{entity_name})
                .subscribe(result => {
                    if (result.success) {
                        this.toaster.show(result);
                        this.goBack();
                    }
                });
        });
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

    deleteItem() {
        this.execute(!this.isNew(), ConfirmationMessages.{entity_name}.remove, () => {
            this.{entity_name}Service.remove(this.{entity_name}.id)
                .subscribe(result => {
                    if (result.success) {
                        this.toaster.show(result);
                        this.goBack();
                    }
                });
        });
    }

    ngOnInit(): void {
        this.saveButtonPermission = this.getSavePermission();

        this.loadParams();
        this.loadDetails();
    }

}