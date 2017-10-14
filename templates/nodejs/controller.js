/*global require, module*/
var {model_name} = require('../models/{model_filename}'),
    pagination = require('../utils/pagination'),
    messageHandler = require('../utils/messageHandler')

    list = function (req, res) {
        'use strict';

        pagination.paginate({model_name}.find(), null, req.query.sort, function (err, {entity_plural_name}) {
            messageHandler.wrapResponse(res, err, {entity_plural_name});
        });
    },

    search = function (req, res) {
        'use strict';

        var pagingOptions = {},
            query = Car.find(),
            regex;

        if (req.query.currentPage) {
            pagingOptions.currentPage = req.query.currentPage;
        }

        if (req.query.pageSize) {
            pagingOptions.pageSize = req.query.pageSize;
        }

        if (req.body.searchCriteria) {
{search_fields}
        }

        pagination.paginate(query, pagingOptions, req.query.sort, function (err, {entity_plural_name}) {
            messageHandler.wrapResponse(res, err, {entity_plural_name});
        });
    },

    get = function (req, res) {
        'use strict';

        {model_name}.findById(req.params.id, function (err, {entity_name}) {
            messageHandler.wrapResponse(res, err, {entity_name});
        });
    },

    add = function (req, res) {
        'use strict';

        // validations
        if (req.validations && req.validations.length > 0) {
            return messageHandler.wrapResponse(res, req.validations);
        }

        var model = new {model_name}(req.body);

        model.save(function (err, result) {
            messageHandler.wrapResponse(res, err, result);
        });
    },

    update = function (req, res) {
        'use strict';

        // validations
        if (req.validations && req.validations.length > 0) {
            return messageHandler.wrapResponse(res, req.validations);
        }

        {update_fields}

        {model_name}.findByIdAndUpdate(req.params.id, data, function (err, {entity_name}) {
            messageHandler.wrapResponse(res, err, {entity_name});
        });
    },

    remove = function (req, res) {
        'use strict';

        {model_name}.findByIdAndRemove(req.params.id, function (err, {entity_name}) {
            messageHandler.wrapResponse(res, err, {entity_name});
        });
    };

module.exports = {
    list: list,
    search: search,
    get: get,
    add: add,
    update: update,
    remove: remove
};