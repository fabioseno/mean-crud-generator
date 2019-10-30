var mongoose = require('mongoose'),
    logSchema = new mongoose.Schema({
        moduleName: {
            required: true,
            type: String,
            trim: true
        },
        moduleVersion: {
            required: true,
            type: String,
            trim: true
        },
        context: {
            type: String,
            trim: true
        },
        logType: {
            required: true,
            type: String,
            'enum': ['info', 'warn', 'debug', 'error', 'metrics']
        },
        value: {
            required: true,
            type: String,
            trim: true
        },
        deviceContext: {
            type: String,
            trim: true
        },
        userLogin: {
            required: true,
            type: String,
            trim: true
        },
        logDate: {
            required: true,
            type: Date
        }
    });

module.exports = mongoose.model('Log', logSchema);