module.exports = function (context) {
	var fileController = require('./file.controller')(context),
		router = context.router;

	// Get
	router.get('/file/:id', fileController.get);

	// API
	// Get
	router.get('/api/file/:id', fileController.get);

};