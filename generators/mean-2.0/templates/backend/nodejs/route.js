/*global module, require*/
module.exports = function (context) {
    var {controller_name} = require('./{controller_filename}')(context);{validation_require}
    var auth = context.session;
    var router = context.router;
    
    // List
    router.get('/{entity_plural_name}', auth.isLogged, {controller_name}.list);
    
    // Get
    router.get('/{entity_plural_name}/:id', auth.isLogged, {controller_name}.get);
    
    // Add
    router.put('/{entity_plural_name}', auth.isLogged, {required_middleware}{unique_middleware}{controller_name}.add);
    
    // Update
    router.post('/{entity_plural_name}/:id', auth.isLogged, {required_middleware}{unique_middleware}{controller_name}.update);
    
    // Remove
    router['delete']('/{entity_plural_name}/:id', auth.isLogged, {controller_name}.remove);
    
};