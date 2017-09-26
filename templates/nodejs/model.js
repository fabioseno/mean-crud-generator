/*global require, module*/
var mongoose = require('mongoose'),
    userSchema = new mongoose.Schema({fields});
    //model.creationDate = new Date();
);

{entityModelSchema}.virtual('id').get(function () {
    'use strict';

    return this._id.toHexString();
});

// {entityModelSchema}.methods.toJSON = function () {
//     var obj = this.toObject()
//     delete obj.password
//     delete obj.creationDate
//     delete obj.lastLogin
//     delete obj.__v
//     return obj
// }

module.exports = mongoose.model('{entityName}', {entityModelSchema});