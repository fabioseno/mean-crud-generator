/*global module, require*/
module.exports = function (router) {
    var {controller_name} = require('../controllers/{controller_filename}');{validation_require}
    var auth = require('../middlewares/session');
    
    // List
    router.get('/{entity_plural_name}', auth.isLogged, {controller_name}.list);
    
    // Search
    router.post('/{entity_plural_name}/search', auth.isLogged, {controller_name}.search);

    // Get
    router.get('/{entity_plural_name}/:id', auth.isLogged, {controller_name}.get);
    
    // Add
    router.put('/{entity_plural_name}', auth.isLogged, {required_middleware}{unique_middleware}{controller_name}.add);
    
    // Update
    router.post('/{entity_plural_name}/:id', auth.isLogged, {required_middleware}{unique_middleware}{controller_name}.update);
    
    // Remove
    router['delete']('/{entity_plural_name}/:id', auth.isLogged, {controller_name}.remove);
    
};