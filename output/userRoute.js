/*global module, require*/
module.exports = function (router) {
    'use strict';
    
    var userController = require('../controllers/user');
    
    // List
    router.get('/users', userController.list);
    
    // Get
    router.get('/users/:id', userController.get);
    
    // Add
    router.put('/users', userController.add);
    
    // Update
    router.post('/users/:id', userController.update);
    
    // Remove
    router['delete']('/users/:id', userController.remove);
    
};