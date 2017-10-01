/*global angular*/
(function () {
    'use strict';

    function {model_plural_name}($location, {entity_name}Manager) {
        var vm = this;

        vm.filter = {
            sort: 'nome',
            p: 1, // currentPage
            s: 10  // pageSize
        };
        
        vm.add{model_name} = function () {
            $location.url('/admin/{plural_name}/add');
        };

        vm.list{model_plural_name} = function () {
            {entity_name}Manager.list{model_plural_name}().then(function (result) {
                if (result.sucesso) {
                    vm.{plural_name} = result.data;
                    vm.filter.p = result.page.currentPage;
                    vm.filter.totalItems = result.page.totalItems;
                }
            });
        };

        vm.list{model_plural_name}();
    }

    {model_plural_name}.$inject = ['$location', '{entity_name}Manager'];

    angular.module('app').controller('{plural_name}', {model_plural_name});

}());