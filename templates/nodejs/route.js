/*global module, require*/
module.exports = function (router) {
    'use strict';
    
    var {controllerName} = require('../controllers/{entityName}');
    var auth = require('../middlewares/session');
    
    // List
    router.get('/{pluralEntityName}', auth.isLogged, {controllerName}.list);
    
    // Search
    router.post('/{pluralEntityName}/search', auth.isLogged, {controllerName}.search);

    // Get
    router.get('/{pluralEntityName}/:id', auth.isLogged, {controllerName}.get);
    
    // Add
    router.put('/{pluralEntityName}', auth.isLogged, {controllerName}.add);
    
    // Update
    router.post('/{pluralEntityName}/:id', auth.isLogged, {controllerName}.update);
    
    // Remove
    router['delete']('/{pluralEntityName}/:id', auth.isLogged, {controllerName}.remove);
    
};