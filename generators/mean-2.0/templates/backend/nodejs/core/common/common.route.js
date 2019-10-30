module.exports = function (context) {
    var commonController = require('./common.controller')(context),
        router = context.router;

    router.all('*', commonController.auth);
    router.get('/', commonController.ping);
};