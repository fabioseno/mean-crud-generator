/*global angular*/
(function () {
    'use strict';

    function Car($location, $mdDialog, $stateParams, carManager, toaster) {
        var vm = this;

        vm.operation = ((!$stateParams.id || $stateParams.id === 'add') ? 'add' : 'edit');
        vm.actionButtonLabel = (vm.operation === 'add' ? 'Adicionar' : 'Atualizar');
        vm.car = {};
        
        vm.getDetails = function () {
            var params;

            if ($stateParams.id && $stateParams.id !== 'add') {
                params = {
                    query: {
                        id: $stateParams.id
                    }
                };

                carManager.getCar(params).then(function (result) {
                    if (result.sucesso) {
                        vm.car = result.data;
                    }
                });
            }
        };

        vm.saveCar = function () {
            var confirm, params = {
                data: vm.car
            };

            if (vm.form.$valid) {
                if (vm.operation === 'add') {
                    confirm = $mdDialog.confirm()
                        .title('Carro')
                        .content('Confirma a criação do carro?')
                        .ariaLabel('Criação de carro')
                        .ok('Sim')
                        .cancel('Não');

                    $mdDialog.show(confirm).then(function () {
                        profileManager.createCar(params).then(function (result) {
                            if (result.sucesso) {
                                toaster.show('Carro criado com sucesso!');
                                $location.url('/admin/cars');
                            }
                        });
                    });
                } else {
                    confirm = $mdDialog.confirm()
                        .title('Carro')
                        .content('Confirma a atualização do carro?')
                        .ariaLabel('Alteração de carro')
                        .ok('Sim')
                        .cancel('Não');

                    params.query = {
                        id: $stateParams.id
                    };

                    $mdDialog.show(confirm).then(function () {
                        profileManager.updateCar(params).then(function (result) {
                            if (result.sucesso) {
                                toaster.show('Carro alterado com sucesso!');
                                $location.url('/admin/cars');
                            }
                        });
                    });
                }
            }
        };

        vm.deleteCar = function () {
            var confirm = $mdDialog.confirm()
                .title('Carro')
                .content('Confirma a exclusão do carro?')
                .ariaLabel('Exclusão de carro')
                .ok('Sim')
                .cancel('Não');

            $mdDialog.show(confirm).then(function () {
                var params = {
                    query: {
                        id: $stateParams.id
                    }
                };

                profileManager.deleteCar(params).then(function (result) {
                    if (result.sucesso) {
                        toaster.show('Carro excluído com sucesso!');
                        $location.url('/admin/cars');
                    }
                });
            });
        };

        vm.cancel = function () {
            $location.url('/admin/cars');
        };

        vm.getDetails();
    }

    Car.$inject = ['$location', '$mdDialog', '$stateParams', 'carManager', 'toaster'];

    angular.module('app').controller('usuario', Car);

}());