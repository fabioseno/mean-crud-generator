/*global require, module*/
var {domain_name} = require('./{domain_filename}'),
    messageHandler = require('../utils/messageHandler')

    list = async function (req, res) {
        try {
            var {entity_plural_name} = await {domain_name}.list(req.query);

            messageHandler.wrapResponse(res, null, {entity_plural_name});
        }
        catch (error) {
            messageHandler.wrapResponse(res, error);
        }
    },

    get = async function (req, res) {
        try {
            var {entity_name} = await {domain_name}.get(req.params.id);

            messageHandler.wrapResponse(res, null, {entity_name});
        }
        catch (error) {
            messageHandler.wrapResponse(res, error);
        }
    },

    add = async function (req, res) {
        try {
            var {entity_name} = await {domain_name}.add(req.body);

            messageHandler.wrapResponse(res, '{entity_label} adicionado com sucesso', {entity_name});
        }
        catch (error) {
            messageHandler.wrapResponse(res, error);
        }
    },

    update = async function (req, res) {
        try {
            var {entity_name} = await {domain_name}.update(req.params.id, req.body);

            messageHandler.wrapResponse(res, '{entity_label} alterado com sucesso', {entity_name});
        }
        catch (error) {
            messageHandler.wrapResponse(res, error);
        }
    },

    remove = async function (req, res) {
        try {
            var {entity_name} = await {domain_name}.remove(req.params.id);

            messageHandler.wrapResponse(res, '{entity_label} excluído com sucesso', {entity_name});
        }
        catch (error) {
            messageHandler.wrapResponse(res, error);
        }
    };

module.exports = {
    list: list,
    get: get,
    add: add,
    update: update,
    remove: remove
};