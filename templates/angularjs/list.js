/*global angular*/
(function () {
    'use strict';

    function Users($location, profileManager) {
        var vm = this;

        vm.filter = {
            sort: 'nome',
            p: 1, // currentPage
            s: 10  // pageSize
        };
        
        vm.addUser = function () {
            $location.url('/admin/usuarios/add');
        };

        vm.listUsers = function () {
            profileManager.listUsers().then(function (result) {
                if (result.sucesso) {
                    vm.users = result.data;
                    vm.filter.p = result.page.currentPage;
                    vm.filter.totalItems = result.page.totalItems;
                }
            });
        };

        vm.listUsers();
    }

    Users.$inject = ['$location', 'profileManager'];

    angular.module('app').controller('usuarios', Users);

}());