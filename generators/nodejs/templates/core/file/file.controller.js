module.exports = function (context) {
	var File = require('./file.model'),
		
		get = function (req, res) {
			if (req.params.id) {
				File.findById(req.params.id, function (err, result) {
					var img = '';

					if (result) {
						img = 'data:' + result.contentType + ';base64,' + result.data.toString('base64');
					}

					res.send(img);
				});
			}
		};

	return {
		get: get
	};
};