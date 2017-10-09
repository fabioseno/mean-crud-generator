/*global angular*/
(function () {
    'use strict';

    function cars($location, carManager) {
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

        vm.listcars = function () {
            carManager.listcars(vm.params).then(function (result) {
                if (result.sucesso) {
                    vm.cars = result.data;
                    vm.filter.currentPage = result.page.currentPage;
                    vm.filter.totalItems = result.page.totalItems;
                }
            });
        };

        vm.listcars();
    }

    cars.$inject = ['$location', 'carManager'];

    angular.module('app').controller('cars', cars);

}());