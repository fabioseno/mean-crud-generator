/*global angular*/
(function () {
    'use strict';

    function carss($location, carManager) {
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

        vm.listcarss = function () {
            carManager.listcarss(vm.params).then(function (result) {
                if (result.sucesso) {
                    vm.cars = result.data;
                    vm.filter.currentPage = result.page.currentPage;
                    vm.filter.totalItems = result.page.totalItems;
                }
            });
        };

        vm.listcarss();
    }

    carss.$inject = ['$location', 'carManager'];

    angular.module('app').controller('cars', carss);

}());