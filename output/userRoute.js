/*global module, require*/
module.exports = function (router) {
    'use strict';
    
    var userController = require('../controllers/user');
    var auth = require('../middlewares/session');
    
    // List
    router.get('/users', auth.isLogged, userController.list);
    
    // Search
    router.post('/users/search', auth.isLogged, auth, userController.search);

    // Get
    router.get('/users/:id', auth.isLogged, userController.get);
    
    // Add
    router.put('/users', auth.isLogged, userController.add);
    
    // Update
    router.post('/users/:id', auth.isLogged, userController.update);
    
    // Remove
    router['delete']('/users/:id', auth.isLogged, userController.remove);
    
};