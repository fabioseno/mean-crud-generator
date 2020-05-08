module.exports = function (context) {
    
    const createContext = function (connection) {

        const list = function (filter) {
            let query = `SELECT * FROM {table_name} WHERE 1 = 1 `
            let params = [];

{search_fields}

            let pagingOptions = {
                page: filter.page,
                size: filter.size,
                sort: filter.sort {order_by_fields}
            }

            return context.paginator.paginate(connection, query, params, pagingOptions);
        };

        const get = function (id) {
            let query = `SELECT * FROM {table_name} WHERE id = ?`;

            return connection.query(query, [id])
                .then(results => results.find(item => item))
                .then({entity_name} => {
                    if (!{entity_name}) {
                        throw '{entity_title} não encontrado'
                    }

                    return {entity_name};
                });
        };

        const add = function (data) {
            let query = `INSERT INTO {table_name} ({insert_fields}) VALUES (?)`;

            let params = [{ insert_values }];

            return connection.query(query, [params])
                .then(results => {entity_name} = get(results.insertId))
        };

        const update = function (id, data) {
            let query = `UPDATE {table_name}
                SET {update_fields} 
                WHERE id = ?`;

            let params = [{update_params}, id];

            return connection.query(query, params)
                .then(() => get(id));
        };

        const remove = function (id) {
            let query = `DELETE FROM {table_name} WHERE id = ?`;

            return connection.query(query, [id])
                .then(() => true);
        };

        return {
            list,
            get,
            add,
            update,
            remove
        };
    };

    return {
        createContext
    };
};