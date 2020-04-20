var mongoose = require('mongoose'),
	fileSchema = new mongoose.Schema({
		fileName: {
			required: true,
			type: String
		},
		contentType: {
			required: true,
			type: String
		},
		data: {
			type: Buffer
		},
		registrationDate: {
			required: true,
			type: Date
		}
	});

module.exports = mongoose.model('File', fileSchema);