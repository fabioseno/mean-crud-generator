var mongoose = require('mongoose'),

    emailSchema = new mongoose.Schema({
        from: {
            required: true,
            type: String,
            trim: true
        },
        to: {
            required: true,
            type: [String]
        },
        cc: {
            type: [String]
        },
        bcc: {
            type: [String]
        },
        attachments: {
            type: [Buffer]
        },
        subject: {
            required: true,
            type: String,
            trim: true
        },
        body: {
            required: true,
            type: String
        },
        bodyType: {
            required: true,
            type: String,
            'enum': ['html', 'text']
        },
        creationDate: {
            required: true,
            type: Date
        },
        status: {
            required: true,
            type: String,
            'enum': ['queued', 'sending', 'sent', 'error']
        },
        sentDate: {
            type: Date
        },
        lastRetryDate: {
            type: Date
        },
        numberOfRetries: {
            type: Number
        },
        errorDescription: {
            type: String,
        }
    });

module.exports = mongoose.model('Email', emailSchema);