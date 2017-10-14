$stateProvider.state('{entity_plural_name}', {
    url: '/{entity_plural_name}',
    templateUrl: 'app/sites/cars.html',
    controller: 'cars as vm'
}).state('{entity_plural_name}', {
    url: '/{entity_plural_name}/:id',
    templateUrl: 'app/sites/car.html',
    controller: 'car as vm'
})