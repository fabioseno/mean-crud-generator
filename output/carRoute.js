/*global module, require*/
module.exports = function (router) {
    'use strict';
    
    var carController = require('../controllers/car');
    var auth = require('../middlewares/session');
    
    // List
    router.get('/cars', auth.isLogged, carController.list);
    
    // Search
    router.post('/cars/search', auth.isLogged, carController.search);

    // Get
    router.get('/cars/:id', auth.isLogged, carController.get);
    
    // Add
    router.put('/cars', auth.isLogged, carController.add);
    
    // Update
    router.post('/cars/:id', auth.isLogged, carController.update);
    
    // Remove
    router['delete']('/cars/:id', auth.isLogged, carController.remove);
    
};