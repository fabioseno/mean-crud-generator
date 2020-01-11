module.exports = function (context) {
    var {domain_name} = require('./{domain_filename}')(context),
        messageHandler = context.utils.messageHandler,

        list = async function (req, res) {
            try {
                var {entity_plural_name} = await {domain_name}.list(req.query);

                return messageHandler.wrapResponse(res, null, {entity_plural_name});
            }
            catch (error) {
                return messageHandler.wrapResponse(res, error);
            }
        },

        get = async function (req, res) {
            try {
                var {entity_name} = await {domain_name}.get(req.params.id);

                return messageHandler.wrapResponse(res, null, {entity_name});
            }
            catch (error) {
                return messageHandler.wrapResponse(res, error);
            }
        },

        add = async function (req, res) {
            try {
                var {entity_name} = await {domain_name}.add(req.body);

                return messageHandler.wrapResponse(res, '{entity_title} adicionado com sucesso', {entity_name});
            }
            catch (error) {
                return messageHandler.wrapResponse(res, error);
            }
        },

        update = async function (req, res) {
            try {
                var {entity_name} = await {domain_name}.update(req.params.id, req.body);

                return messageHandler.wrapResponse(res, '{entity_title} alterado com sucesso', {entity_name});
            }
            catch (error) {
                return messageHandler.wrapResponse(res, error);
            }
        },

        remove = async function (req, res) {
            try {
                var {entity_name} = await {domain_name}.remove(req.params.id);

                return messageHandler.wrapResponse(res, '{entity_title} excluído com sucesso', {entity_name});
            }
            catch (error) {
                return messageHandler.wrapResponse(res, error);
            }
        };

    return {
        list: list,
        get: get,
        add: add,
        update: update,
        remove: remove
    };
}