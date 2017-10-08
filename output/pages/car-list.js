/*global angular*/
(function () {
    'use strict';

    function carss($location, carManager) {
        var vm = this;

        vm.filter = {
            sort: 'nome',
            p: 1, // currentPage
            s: 10  // pageSize
        };
        
        vm.addCar = function () {
            $location.url('/admin/cars/add');
        };

        vm.listcarss = function () {
            carManager.listcarss().then(function (result) {
                if (result.sucesso) {
                    vm.cars = result.data;
                    vm.filter.p = result.page.currentPage;
                    vm.filter.totalItems = result.page.totalItems;
                }
            });
        };

        vm.listcarss();
    }

    carss.$inject = ['$location', 'carManager'];

    angular.module('app').controller('cars', carss);

}());