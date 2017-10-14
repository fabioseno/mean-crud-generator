/*global angular*/
(function () {
    'use strict';

    function {model_name_plural}($location, {entity_name}Manager) {
        var vm = this;

        vm.params = {
            query: {
                sort: 'nome',
                currentPage: 1,
                pageSize: 10
            }
        };
        
        vm.add{model_name} = function () {
            $location.url('/admin/{entity_name_plural}/add');
        };

        vm.list{model_name_plural} = function () {
            {entity_name}Manager.list{model_name_plural}(vm.params).then(function (result) {
                if (result.sucesso) {
                    vm.{entity_name_plural} = result.data;
                    vm.filter.currentPage = result.page.currentPage;
                    vm.filter.totalItems = result.page.totalItems;
                }
            });
        };

        vm.list{model_name_plural}();
    }

    {model_name_plural}.$inject = ['$location', '{entity_name}Manager'];

    angular.module('app').controller('{entity_name_plural}', {model_name_plural});

}());