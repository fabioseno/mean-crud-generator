import { Injectable } from '@angular/core';

import { ModuleService } from '../../../';

@Injectable()
export class {model_name}Service {

    constructor(public moduleService: ModuleService) {}

    list(filter: any = {}) {
        var params = {
            query: filter
        };

        return this.moduleService.moduleHttpInvoker.invoke('{entity_name}', 'list', params);
    }

    get({entity_name}Id) {
        var params = {
            query: {
                {entity_name}Id: {entity_name}Id
            },
        };

        return this.moduleService.moduleHttpInvoker.invoke('{entity_name}', 'get', params);
    }

    add(data) {
        var params = {
            data: data
        };

        return this.moduleService.moduleHttpInvoker.invoke('{entity_name}', 'add', params);
    }

    update({entity_name}Id, data) {
        var params = {
            query: {
                {entity_name}Id: {entity_name}Id
            },
            data: data
        };

        return this.moduleService.moduleHttpInvoker.invoke('{entity_name}', 'update', params);
    }

    remove({entity_name}Id) {
        var params = {
            query: {
                {entity_name}Id: {entity_name}Id
            }
        };

        return this.moduleService.moduleHttpInvoker.invoke('{entity_name}', 'remove', params);
    }

}