/*global angular*/
(function () {
    'use strict';

    function {model_name}($location, $mdDialog, $stateParams, registrationManager, {entity_name}Manager, toaster) {
        var vm = this;

        vm.operation = ((!$stateParams.id || $stateParams.id === 'add') ? 'add' : 'edit');
        vm.actionButtonLabel = (vm.operation === 'add' ? 'Adicionar' : 'Atualizar');
        vm.{entity_name} = {};
        vm.mask = registrationManager.mask;
        
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
            var confirm, selected, params = {};

            if (vm.userForm.$valid) {
                params.data = {
                    nomeCliente: vm.user.nomeCliente,
                    tipoPessoa: 'F',
                    rg: vm.user.rg,
                    dataNascimento: vm.dataNascimento,
                    email: vm.user.email
                };

                if (vm.operation === 'add') {
                    params.data.cpfCnpj = vm.user.cpfCnpj;
                    params.data.senha = vm.user.senha;

                    confirm = $mdDialog.confirm()
                        .title('Usuário')
                        .content('Confirma a criação do usuário?')
                        .ariaLabel('Criação de usuário')
                        .ok('Sim')
                        .cancel('Não');

                    $mdDialog.show(confirm).then(function () {
                        profileManager.create{model_name}(params).then(function (result) {
                            if (result.sucesso) {
                                toaster.show('Usuário criado com sucesso!');
                                $location.url('/admin/usuarios');
                            }
                        });
                    });
                } else {
                    confirm = $mdDialog.confirm()
                        .title('Usuário')
                        .content('Confirma a atualização do usuário?')
                        .ariaLabel('Alteração de usuário')
                        .ok('Sim')
                        .cancel('Não');

                    params.query = {
                        id: $stateParams.id
                    };

                    $mdDialog.show(confirm).then(function () {
                        profileManager.update{model_name}(params).then(function (result) {
                            if (result.sucesso) {
                                toaster.show('Usuário alterado com sucesso!');
                                $location.url('/admin/usuarios');
                            }
                        });
                    });
                }
            }
        };

        vm.delete{model_name} = function () {
            var confirm = $mdDialog.confirm()
                .title('Usuário')
                .content('Confirma a exclusão do usuário?')
                .ariaLabel('Exclusão de usuário')
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
                        toaster.show('Usuário excluído com sucesso!');
                        $location.url('/admin/usuarios');
                    }
                });
            });
        };

        vm.cancel = function () {
            $location.url('/admin/{plural_name}');
        };

        vm.getDetails();
    }

    {model_name}.$inject = ['$location', '$mdDialog', '$stateParams', 'registrationManager', '{entity_name}Manager', 'toaster'];

    angular.module('app').controller('usuario', {model_name});

}());