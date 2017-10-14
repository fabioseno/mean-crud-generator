/*global angular*/
(function () {
    'use strict';

    function Cars($location, carManager) {
        var vm = this;

        vm.params = {
            query: {
                sort: 'nome',
                currentPage: 1,
                pageSize: 10
            }
        };
        
        vm.addCar = function () {
            $location.url('/admin/cars/add');
        };

        vm.listCars = function () {
            carManager.listCars(vm.params).then(function (result) {
                if (result.sucesso) {
                    vm.cars = result.data;
                    vm.filter.currentPage = result.page.currentPage;
                    vm.filter.totalItems = result.page.totalItems;
                }
            });
        };

        vm.listCars();
    }

    Cars.$inject = ['$location', 'carManager'];

    angular.module('app').controller('{plural_name}', Cars);

}());