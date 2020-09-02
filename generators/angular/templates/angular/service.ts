import { Injectable } from '@angular/core';

import { BackofficeEndpointsConfig } from '../../../';
import { HttpInvoker } from '../../../core/';

@Injectable()
export class {model_name}Service {

    private httpInvoker;

    constructor(private httpInvokerFactory: HttpInvoker) {
        this.httpInvoker = this.httpInvokerFactory.loadConfig(BackofficeEndpointsConfig);
    }

    list(filter: any = {}) {
        var params = {
            query: filter
        };

        return this.httpInvoker.invoke('{entity_name}', 'list', params);
    } x

    get({entity_name}Id) {
        var params = {
            query: {
                {entity_name}Id: {entity_name}Id
            }
        };

        return this.httpInvoker.invoke('{entity_name}', 'get', params);
    }

    add(data) {
        var params = {
            data: data
        };

        return this.httpInvoker.invoke('{entity_name}', 'add', params);
    }

    update({entity_name}Id, data) {
        var params = {
            query: {
                {entity_name}Id: {entity_name}Id
            },
            data: data
        };

        return this.httpInvoker.invoke('{entity_name}', 'update', params);
    }

    remove({entity_name}Id) {
        var params = {
            query: {
                {entity_name}Id: {entity_name}Id
            }
        };

        return this.httpInvoker.invoke('{entity_name}', 'remove', params);
    }

}