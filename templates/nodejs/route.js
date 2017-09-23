/*global module, require*/
module.exports = function (router) {
    'use strict';
    
    var {controllerName} = require('../controllers/{entityName}');
    
    // List All
    router.get('/{pluralEntityName}', {controllerName}.list);
    
    // Get
    router.get('/{entityName}/:id', {controllerName}.get);
    
    // Add
    router.put('/{pluralEntityName}', {controllerName}.add);
    
    // Save
    router.post('/{entityName}/:id', {controllerName}.update);
    
    // Delete
    router['delete']('/{entityName}/:id', {controllerName}.remove);
    
};