/*global require, module*/
var mongoose = require('mongoose'),
    userSchema = new mongoose.Schema({
        firstName: {
            required: true,
            type: String,
            trim: true
        },
        lastName: {
            required: true,
            type: String,
            trim: true
        },
        email: {
            required: true,
            type: String,
            trim: true
        },
        birthday: {
            required: true,
            type: Date
        },
        login: {
            required: true,
            type: String
        },
        password: {
            required: true,
            type: String
        },
        creationDate: {
            required: true,
            type: Date
        },
        lastLogin: {
            type: Date
        },
        status: {
            required: true,
            type: String
        }
    });

userSchema.virtual('id').get(function () {
    'use strict';

    return this._id.toHexString();
});

userSchema.methods.toJSON = function () {
    var obj = this.toObject()
    delete obj.password
    delete obj.creationDate
    delete obj.lastLogin
    delete obj.__v
    return obj
}

module.exports = mongoose.model('User', userSchema);

model.creationDate = new Date();