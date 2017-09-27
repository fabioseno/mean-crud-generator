/*global require, module*/
var mongoose = require('mongoose'),
    userSchema = new mongoose.Schema({fields});
);

{entityModelSchema}.virtual('id').get(function () {
    'use strict';

    return this._id.toHexString();
});

module.exports = mongoose.model('{modelName}', {entityModelSchema});