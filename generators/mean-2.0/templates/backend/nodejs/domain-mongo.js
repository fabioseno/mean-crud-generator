module.exports = function (context) {
    var {model_name} = require('./{model_filename}'),
        pagination = context.utils.pagination,

        list = function (params) {
            var filter = {};

{search_fields}

            let query = {model_name}.find(filter).sort({ 'name': 1 });

            return pagination.paginate(query, params);
        },

        get = function (id) {
            return {model_name}.findById(id).exec();
        },

        add = function (data) {
            let {entity_name} = new {model_name}(data);

            return {entity_name}.save();
        },

        update = function (id, data) {
            return {model_name}.findByIdAndUpdate(id, {update_fields}).exec();
        },

        remove = function (id) {
            return {model_name}.findByIdAndRemove(id).exec();
        };

    return {
        list: list,
        get: get,
        add: add,
        update: update,
        remove: remove
    };
};