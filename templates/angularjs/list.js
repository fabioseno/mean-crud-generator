/*global angular*/
(function () {
    'use strict';

    function {model_plural_name}($location, {entity_name}Manager) {
        var vm = this;

        vm.params = {
            query: {
                sort: 'nome',
                currentPage: 1,
                pageSize: 10
            }
        };
        
        vm.add{model_name} = function () {
            $location.url('/admin/{plural_name}/add');
        };

        vm.list{model_plural_name} = function () {
            {entity_name}Manager.list{model_plural_name}(vm.params).then(function (result) {
                if (result.sucesso) {
                    vm.{plural_name} = result.data;
                    vm.filter.currentPage = result.page.currentPage;
                    vm.filter.totalItems = result.page.totalItems;
                }
            });
        };

        vm.list{model_plural_name}();
    }

    {model_plural_name}.$inject = ['$location', '{entity_name}Manager'];

    angular.module('app').controller('{plural_name}', {model_plural_name});

}());