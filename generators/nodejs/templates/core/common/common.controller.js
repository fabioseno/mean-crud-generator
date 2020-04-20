module.exports = function (context) {
    const auth = function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-AppToken, X-SessionID');
        res.header('Access-Control-Expose-Headers', 'X-SessionID');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');

        next();
    };

    const ping = function (req, res) {
        res.send('Server is up and running!');
    };

    return {
        auth,
        ping
    };
};