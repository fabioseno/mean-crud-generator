/*global module, require*/
module.exports = function (router) {
    'use strict';
    
    var {controller_name} = require('../controllers/{controller_filename}');{validation_require}
    var auth = require('../middlewares/session');
    
    // List
    router.get('/{plural_entity_name}', auth.isLogged, {controller_name}.list);
    
    // Search
    router.post('/{plural_entity_name}/search', auth.isLogged, {controller_name}.search);

    // Get
    router.get('/{plural_entity_name}/:id', auth.isLogged, {controller_name}.get);
    
    // Add
    router.put('/{plural_entity_name}', auth.isLogged, {middleware_list}{controller_name}.add);
    
    // Update
    router.post('/{plural_entity_name}/:id', auth.isLogged, {middleware_list}{controller_name}.update);
    
    // Remove
    router['delete']('/{plural_entity_name}/:id', auth.isLogged, {controller_name}.remove);
    
};