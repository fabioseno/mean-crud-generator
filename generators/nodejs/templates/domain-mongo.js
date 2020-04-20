module.exports = function (context) {
    const {model_name} = require('./{model_filename}');
    const pagination = context.utils.pagination;

    const list = function (params) {
        var filter = {};

{search_fields}

        let query = {model_name}.find(filter).sort({ 'name': 1 });

        return pagination.paginate(query, params);
    };

    const get = function (id) {
        return {model_name}.findById(id).exec();
    };

    const add = function (data) {
        let {entity_name} = new {model_name}(data);

        return {entity_name}.save();
    };

    const update = function (id, data) {
        return {model_name}.findByIdAndUpdate(id, {update_fields}).exec();
    };

    const remove = function (id) {
        return {model_name}.findByIdAndRemove(id).exec();
    };

    return {
        list,
        get,
        add,
        update,
        remove
    };
};