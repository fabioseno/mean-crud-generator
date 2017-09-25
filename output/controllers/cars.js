/*global require, module*/
var Car = require('../models/car.js'),
    pagination = require('../utils/pagination'),
    messageHandler = require('../utils/messageHandler')

    list = function (req, res) {
        'use strict';

        pagination.paginate(Car.find(), null, null, function (err, cars) {
            messageHandler.wrapResponse(res, err, cars);
        });
    },

    search = function (req, res) {
        'use strict';

        var pagingOptions = req.body.pagingOptions,
            sortOptions = req.body.sortOptions,
            query = Car.find(),
            regex;

        if (req.body.searchCriteria) {
            //TODO:  search criteria here
            if (req.body.searchCriteria.name) {
                regex = new RegExp(req.body.searchCriteria.name, 'i');

                query = query.or([{
                    'firstName': {
                        $regex: regex
                    }
                }, {
                    'lastName': {
                        $regex: regex
                    }
                }]);
            }

            if (req.body.searchCriteria.login) {
                regex = new RegExp(req.body.searchCriteria.login, 'i');

                query = query.where('login', {
                    $regex: regex
                });
            }
        }

        pagination.paginate(query, pagingOptions, sortOptions, function (err, cars) {
            messageHandler.wrapResponse(res, err, cars);
        });
    },

    get = function (req, res) {
        'use strict';

        Car.findById(req.params.id, function (err, car) {
            messageHandler.wrapResponse(res, err, car);
        });
    },

    add = function (req, res) {
        'use strict';

        // validations
        if (req.validations && req.validations.length > 0) {
            return messageHandler.wrapResponse(res, req.validations);
        }

        var model = new Car(req.body);

        model.creationDate = new Date();

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

        // TODO: update fields
        var data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            birthday: req.body.birthday,
            status: req.body.status
        };

        Car.findByIdAndUpdate(req.params.id, data, function (err, car) {
            messageHandler.wrapResponse(res, err, car);
        });
    },

    remove = function (req, res) {
        'use strict';

        Car.findByIdAndRemove(req.params.id, function (err, car) {
            messageHandler.wrapResponse(res, err, car);
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