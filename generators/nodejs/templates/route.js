/*global module, require*/
module.exports = function (router, context) {
    const {controller_name} = require('./{controller_filename}')(context);{validation_require}
    const auth = context.auth;
    
    // List
    router.get('/backoffice/{entity_plural_name}', auth.hasPermission('{entity_name_upper}.LIST'), {controller_name}.list);
    
    // Get
    router.get('/backoffice/{entity_plural_name}/:id', auth.hasPermission('{entity_name_upper}.GET'), {controller_name}.get);
    
    // Add
    router.post('/backoffice/{entity_plural_name}', auth.hasPermission('{entity_name_upper}.ADD'), {required_middleware}{unique_middleware}{controller_name}.add);
    
    // Update
    router.put('/backoffice/{entity_plural_name}/:id', auth.hasPermission('{entity_name_upper}.UPDATE'), {required_middleware}{unique_middleware}{controller_name}.update);
    
    // Remove
    router['delete']('/backoffice/{entity_plural_name}/:id', auth.hasPermission('{entity_name_upper}.DELETE'), {controller_name}.remove);
    
};