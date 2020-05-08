module.exports = function (context) {
    const {domain_name} = require('./{domain_filename}')(context);
    const messageHandler = context.messageHandler;
    const db = context.db;

    return {
        list: async function (req, res) {
            let connectionManager = await db.createManager();
            let {domain_name}Context = {domain_name}.createContext(connectionManager);
    
            {domain_name}Context.list(req.query)
                .then({entity_plural_name} => messageHandler.wrapResponse(res, null, {entity_plural_name}))
                .catch(error => messageHandler.wrapErrorResponse(res, error))
                .finally(() => connectionManager.end());
        },

        get: async function (req, res) {
            let connectionManager = await db.createManager();
            let {domain_name}Context = {domain_name}.createContext(connectionManager);
    
            {domain_name}Context.get(req.params.id)
                .then({entity_name} => messageHandler.wrapResponse(res, null, {entity_name}))
                .catch(error => messageHandler.wrapErrorResponse(res, error))
                .finally(() => connectionManager.end());
        },

        add: async function (req, res) {
            let connectionManager = await db.createManager(true);
            let {domain_name}Context = {domain_name}.createContext(connectionManager);
    
            {domain_name}Context.add(req.body)
                .then({entity_name} => {
                    connectionManager.commit();
                    return messageHandler.wrapResponse(res, '{entity_title} adicionado com sucesso', {entity_name});
                })
                .catch(error => {
                    connectionManager.rollback();
                    return messageHandler.wrapErrorResponse(res, error);
                })
                .finally(() => connectionManager.end());
        },

        update: async function (req, res) {
            let connectionManager = await db.createManager(true);
            let {domain_name}Context = {domain_name}.createContext(connectionManager);
    
            {domain_name}Context.update(req.params.id, req.body)
                .then({entity_name} => {
                    connectionManager.commit();
                    return messageHandler.wrapResponse(res, '{entity_title} alterado com sucesso', {entity_name});
                })
                .catch(error => {
                    connectionManager.rollback();
                    return messageHandler.wrapErrorResponse(res, error);
                })
                .finally(() => connectionManager.end());
        },

        remove: async function (req, res) {
            let connectionManager = await db.createManager(true);
            let {domain_name}Context = {domain_name}.createContext(connectionManager);
    
            {domain_name}Context.remove(req.params.id)
                .then({entity_name} => {
                    connectionManager.commit();
                    return messageHandler.wrapResponse(res, '{entity_title} excluído com sucesso', {entity_name});
                })
                .catch(error => {
                    connectionManager.rollback();
                    return messageHandler.wrapErrorResponse(res, error);
                })
                .finally(() => connectionManager.end());
        }
    };
}