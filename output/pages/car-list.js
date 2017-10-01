/*global angular*/
(function () {
    'use strict';

    function Cars($location, carManager) {
        var vm = this;

        vm.filter = {
            sort: 'nome',
            p: 1, // currentPage
            s: 10  // pageSize
        };
        
        vm.addCar = function () {
            $location.url('/admin/cars/add');
        };

        vm.listCars = function () {
            carManager.listCars().then(function (result) {
                if (result.sucesso) {
                    vm.cars = result.data;
                    vm.filter.p = result.page.currentPage;
                    vm.filter.totalItems = result.page.totalItems;
                }
            });
        };

        vm.listCars();
    }

    Cars.$inject = ['$location', 'profileManager'];

    angular.module('app').controller('cars', Cars);

}());