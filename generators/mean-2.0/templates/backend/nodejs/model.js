/*global require, module*/
var mongoose = require('mongoose'),
    {entity_model_schema} = new mongoose.Schema({fields});

{entity_model_schema}.virtual('id').get(function () {
    return this._id.toHexString();
});

module.exports = mongoose.model('{model_name}', {entity_model_schema});