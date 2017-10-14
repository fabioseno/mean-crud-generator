$stateProvider.state('car', {
    url: '/car',
    templateUrl: 'app/sites/cars.html',
    controller: 'cars as vm'
}).state('cars', {
    url: '/cars/:id',
    templateUrl: 'app/sites/car.html',
    controller: 'car as vm'
})