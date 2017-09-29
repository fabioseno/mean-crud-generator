/*global angular*/
(function () {
    'use strict';

    function User($location, $mdDialog, $stateParams, registrationManager, profileManager, toaster) {
        var vm = this;

        vm.operation = ((!$stateParams.id || $stateParams.id === 'add') ? 'add' : 'edit');
        vm.actionButtonLabel = (vm.operation === 'add' ? 'Adicionar' : 'Atualizar');
        vm.selectedUserGroups = {};
        vm.userGroups = [];
        vm.user = {};
        vm.mask = registrationManager.mask;
        
        vm.permissionGroups = [];

        vm.toCalendarDate = function (date) {
            var result;

            if (date) {
                result = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
            }

            return new Date(result);
        };

        vm.toFilterDate = function (date) {
            var result;

            if (date) {
                result = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            }

            return result;
        };
		
        vm.birthdayPopupOptions = {
            datepickerMode: 'year'
        };

        vm.openBirthdayCalendar = function () {
            vm.birthdayPopup.opened = true;
        };

        vm.altInputFormats = ['d!/M!/yyyy'];
        
        vm.birthdayPopup = {
            opened: false
        };

        vm.listUserGroups = function () {
            profileManager.listUserGroups().then(function (result) {
                if (result.sucesso) {
                    vm.userGroups = result.data;
                }
            });
        };

        vm.getDetails = function () {
            var params;

            if ($stateParams.id && $stateParams.id !== 'add') {
                params = {
                    query: {
                        id: $stateParams.id
                    }
                };

                profileManager.getUser(params).then(function (result) {
                    var userGroup, i;

                    if (result.sucesso) {
                        vm.user = result.data;

                        vm.dataNascimento = vm.toCalendarDate(new Date(result.data.dataNascimento));

                        if (result.data.perfis) {
                            for (i = 0; i < result.data.perfis.length; i += 1) {
                                userGroup = result.data.perfis[i];

                                vm.selectedUserGroups[userGroup.id] = true;
                            }
                        }
                    }
                });
            }
        };

        vm.saveUser = function () {
            var confirm, selected, params = {};

            if (vm.userForm.$valid) {
                selected = Object.keys(vm.selectedUserGroups).filter(function (key) {
                    return (vm.selectedUserGroups[key]);
                }).map(function (item) {
                    return parseInt(item);
                });

                params.data = {
                    nomeCliente: vm.user.nomeCliente,
                    tipoPessoa: 'F',
                    rg: vm.user.rg,
                    dataNascimento: vm.dataNascimento,
                    email: vm.user.email,
                    perfis: selected
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
                        profileManager.createUser(params).then(function (result) {
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
                        profileManager.updateUser(params).then(function (result) {
                            if (result.sucesso) {
                                toaster.show('Usuário alterado com sucesso!');
                                $location.url('/admin/usuarios');
                            }
                        });
                    });
                }
            }
        };

        vm.deleteUser = function () {
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

                profileManager.deleteUser(params).then(function (result) {
                    if (result.sucesso) {
                        toaster.show('Usuário excluído com sucesso!');
                        $location.url('/admin/usuarios');
                    }
                });
            });
        };

        vm.cancel = function () {
            $location.url('/admin/usuarios');
        };

        vm.listUserGroups();
        vm.getDetails();
    }

    User.$inject = ['$location', '$mdDialog', '$stateParams', 'registrationManager', 'profileManager', 'toaster'];

    angular.module('app').controller('usuario', User);

}());