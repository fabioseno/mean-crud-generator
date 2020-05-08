const mysql = require('mysql');
const config = require('../config/config');

var pool = mysql.createPool(config.db.url);

const createManager = (isTransaction = false) => {
    var _connection;

    var createConnection = () => {
        return new Promise((resolve, reject) => {
            pool.getConnection((connectionError, connection) => {
                if (connectionError) {
                    return reject(connectionError);
                };

                _connection = connection;

                if (isTransaction) {
                    connection.beginTransaction(transactionError => {
                        if (transactionError) {
                            return reject(transactionError);
                        }

                        return resolve(connection);
                    });
                } else {
                    return resolve(connection);
                }
            });
        });
    };

    var end = () => {
        if (_connection) {
            _connection.release();
        }
    };

    var commit = () => {
        if (_connection) {
            _connection.commit();
        }
    };

    var rollback = () => {
        if (_connection) {
            _connection.rollback();
        }
    };

    var query = (query, options) => {
        return new Promise(async (resolve, reject) => {
            let localQuery = false;

            if (!_connection) {
                localQuery = true;
                _connection = await createConnection(false);
            }

            _connection.query(query, options, (error, rows) => {
                if (localQuery && _connection) {
                    _connection.release();
                }

                if (error) {
                    return reject(error);
                }

                return resolve(rows);
            });
        })
    };

    return createConnection().then(() => {
        return {
            end,
            commit,
            rollback,
            query
        };
    });
}

module.exports = {
    createManager
};