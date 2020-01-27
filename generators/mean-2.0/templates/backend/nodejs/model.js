/*global require, module*/
const mongoose = require('mongoose');
const {entity_model_schema} = new mongoose.Schema({fields});

{entity_model_schema}.virtual('id').get(function () {
    return this._id.toHexString();
});

module.exports = mongoose.model('{model_name}', {entity_model_schema});