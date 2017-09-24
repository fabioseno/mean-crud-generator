/*global module, require*/
module.exports = function (router) {
    'use strict';
    
    var {controllerName} = require('../controllers/{entityName}');
    
    // List
    router.get('/{pluralEntityName}', {controllerName}.list);
    
    // Get
    router.get('/{pluralEntityName}/:id', {controllerName}.get);
    
    // Add
    router.put('/{pluralEntityName}', {controllerName}.add);
    
    // Update
    router.post('/{pluralEntityName}/:id', {controllerName}.update);
    
    // Remove
    router['delete']('/{pluralEntityName}/:id', {controllerName}.remove);
    
};