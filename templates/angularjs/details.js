/*global angular*/
(function () {
    'use strict';

    function {model_name}($location, $mdDialog, $stateParams, {entity_name}Manager, toaster) {
        var vm = this;

        vm.operation = (!$stateParams.id ? 'add' : 'edit');
        vm.actionButtonLabel = (vm.operation === 'add' ? 'Adicionar' : 'Atualizar');
        vm.{entity_name} = {};
        
        vm.getDetails = function () {
            var params;

            if ($stateParams.id && $stateParams.id !== 'add') {
                params = {
                    query: {
                        id: $stateParams.id
                    }
                };

                {entity_name}Manager.get{model_name}(params).then(function (result) {
                    if (result.sucesso) {
                        vm.{entity_name} = result.data;
                    }
                });
            }
        };

        vm.save{model_name} = function () {
            var confirm, params = {
                data: vm.{entity_name}
            };

            if (vm.form.$valid) {
                if (vm.operation === 'add') {
                    confirm = $mdDialog.confirm()
                        .title('{details_view_page_title}')
                        .content('Confirma a criação do {entity_title}?')
                        .ariaLabel('Criação de {entity_title}')
                        .ok('Sim')
                        .cancel('Não');

                    $mdDialog.show(confirm).then(function () {
                        profileManager.create{model_name}(params).then(function (result) {
                            if (result.sucesso) {
                                toaster.show('{details_view_page_title} criado com sucesso!');
                                $location.url('/admin/{plural_name}');
                            }
                        });
                    });
                } else {
                    confirm = $mdDialog.confirm()
                        .title('{details_view_page_title}')
                        .content('Confirma a atualização do {entity_title}?')
                        .ariaLabel('Alteração de {entity_title}')
                        .ok('Sim')
                        .cancel('Não');

                    params.query = {
                        id: $stateParams.id
                    };

                    $mdDialog.show(confirm).then(function () {
                        profileManager.update{model_name}(params).then(function (result) {
                            if (result.sucesso) {
                                toaster.show('{details_view_page_title} alterado com sucesso!');
                                $location.url('/admin/{plural_name}');
                            }
                        });
                    });
                }
            }
        };

        vm.delete{model_name} = function () {
            var confirm = $mdDialog.confirm()
                .title('{details_view_page_title}')
                .content('Confirma a exclusão do {entity_title}?')
                .ariaLabel('Exclusão de {entity_title}')
                .ok('Sim')
                .cancel('Não');

            $mdDialog.show(confirm).then(function () {
                var params = {
                    query: {
                        id: $stateParams.id
                    }
                };

                profileManager.delete{model_name}(params).then(function (result) {
                    if (result.sucesso) {
                        toaster.show('{details_view_page_title} excluído com sucesso!');
                        $location.url('/admin/{plural_name}');
                    }
                });
            });
        };

        vm.cancel = function () {
            $location.url('/admin/{plural_name}');
        };

        vm.getDetails();
    }

    {model_name}.$inject = ['$location', '$mdDialog', '$stateParams', '{entity_name}Manager', 'toaster'];

    angular.module('app').controller('{entity_name}', {model_name});

}());