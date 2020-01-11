module.exports = function (context) {
    const uuidv1 = require('uuid/v1');
    const db = context.utils.db;
    const pagination = context.utils.pagination;

        list = function (filter) {
            let query = `SELECT * FROM {table_name} WHERE 1 = 1 `
            let params = [];

{search_fields}
            //query += ` ORDER BY title`;

            let pagingOptions = {
                page: filter.page,
                size: filter.size,
                sort: filter.sort
            }

            return pagination.paginate(query, params, pagingOptions);
        },

        get = function (id) {
            let query = `SELECT * FROM {table_name} WHERE id = ?`;

            return db.query(query, [id]).then(results => {
                let row;

                if (results.length === 1) {
                    row = results[0];
                }

                return row;
            });
        },

        add = function (data) {
            let query = `INSERT INTO {table_name} (id, {insert_fields}) VALUES (?)`;
                
            let params = [uuidv1(), {insert_values}];

            return db.query(query, [params]);
        },

        update = function (id, data) {
            let query = `UPDATE {table_name}
                SET {update_fields} 
                WHERE id = ?`;

            let params = [{update_params}, id];

            return db.query(query, params);
        },

        remove = function (id) {
            let query = `DELETE FROM {table_name} WHERE id = ?`;

            return db.query(query, [id]);
        };

    return {
        list: list,
        get: get,
        add: add,
        update: update,
        remove: remove
    };
};