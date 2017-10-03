/*global angular*/
(function () {
    'use strict';

    function {model_name}($location, $mdDialog, $stateParams, registrationManager, carManager, toaster) {
        var vm = this;

        vm.operation = ((!$stateParams.id || $stateParams.id === 'add') ? 'add' : 'edit');
        vm.actionButtonLabel = (vm.operation === 'add' ? 'Adicionar' : 'Atualizar');
        vm.car = {};
        //vm.mask = registrationManager.mask;
        
        vm.getDetails = function () {
            var params;

            if ($stateParams.id && $stateParams.id !== 'add') {
                params = {
                    query: {
                        id: $stateParams.id
                    }
                };

                carManager.get{model_name}(params).then(function (result) {
                    if (result.sucesso) {
                        vm.car = result.data;
                    }
                });
            }
        };

        vm.save{model_name} = function () {
            var confirm, params = {
                data: vm.car
            };

            if (vm.userForm.$valid) {
                if (vm.operation === 'add') {
                    confirm = $mdDialog.confirm()
                        .title('Car')
                        .content('Confirma a criação do undefined?')
                        .ariaLabel('Criação de undefined')
                        .ok('Sim')
                        .cancel('Não');

                    $mdDialog.show(confirm).then(function () {
                        profileManager.create{model_name}(params).then(function (result) {
                            if (result.sucesso) {
                                toaster.show('Car criado com sucesso!');
                                $location.url('/admin/undefined');
                            }
                        });
                    });
                } else {
                    confirm = $mdDialog.confirm()
                        .title('Car')
                        .content('Confirma a atualização do undefined?')
                        .ariaLabel('Alteração de undefined')
                        .ok('Sim')
                        .cancel('Não');

                    params.query = {
                        id: $stateParams.id
                    };

                    $mdDialog.show(confirm).then(function () {
                        profileManager.update{model_name}(params).then(function (result) {
                            if (result.sucesso) {
                                toaster.show('Car alterado com sucesso!');
                                $location.url('/admin/undefined');
                            }
                        });
                    });
                }
            }
        };

        vm.delete{model_name} = function () {
            var confirm = $mdDialog.confirm()
                .title('Car')
                .content('Confirma a exclusão do undefined?')
                .ariaLabel('Exclusão de undefined')
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
                        toaster.show('Car excluído com sucesso!');
                        $location.url('/admin/undefined');
                    }
                });
            });
        };

        vm.cancel = function () {
            $location.url('/admin/cars');
        };

        vm.getDetails();
    }

    {model_name}.$inject = ['$location', '$mdDialog', '$stateParams', 'registrationManager', 'carManager', 'toaster'];

    angular.module('app').controller('usuario', {model_name});

}());