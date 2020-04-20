module.exports = function (context) {
	var logController = require('./log.controller')(context),
		router = context.router;

	router.get('/logs', logController.list);

	router.post('/logs/search', logController.search);

	router.put('/logs', logController.add);

};