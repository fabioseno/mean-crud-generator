module.exports = function (context) {
    const commonController = require('./common.controller')(context);
    const router = context.router;

    router.all('*', commonController.auth);
    router.get('/', commonController.ping);
};