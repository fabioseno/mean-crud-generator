module.exports = function (context) {
    const {domain_name} = require('./{domain_filename}')(context);
    const messageHandler = context.utils.messageHandler;

    const list = async function (req, res) {
        try {
            var {entity_plural_name} = await {domain_name}.list(req.query);

            return messageHandler.wrapResponse(res, null, {entity_plural_name});
        }
        catch (error) {
            return messageHandler.wrapErrorResponse(res, error);
        }
    };

    const get = async function (req, res) {
        try {
            var {entity_name} = await {domain_name}.get(req.params.id);

            return messageHandler.wrapResponse(res, null, {entity_name});
        }
        catch (error) {
            return messageHandler.wrapErrorResponse(res, error);
        }
    };

    const add = async function (req, res) {
        try {
            var {entity_name} = await {domain_name}.add(req.body);

            return messageHandler.wrapResponse(res, '{entity_title} adicionado com sucesso', {entity_name});
        }
        catch (error) {
            return messageHandler.wrapErrorResponse(res, error);
        }
    };

    const update = async function (req, res) {
        try {
            var {entity_name} = await {domain_name}.update(req.params.id, req.body);

            return messageHandler.wrapResponse(res, '{entity_title} alterado com sucesso', {entity_name});
        }
        catch (error) {
            return messageHandler.wrapErrorResponse(res, error);
        }
    };

    const remove = async function (req, res) {
        try {
            var {entity_name} = await {domain_name}.remove(req.params.id);

            return messageHandler.wrapResponse(res, '{entity_title} excluído com sucesso', {entity_name});
        }
        catch (error) {
            return messageHandler.wrapErrorResponse(res, error);
        }
    };

    return {
        list,
        get,
        add,
        update,
        remove
    };
}