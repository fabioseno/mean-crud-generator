$stateProvider.state('{entity_name}', {
    url: '/{entity_name}',
    templateUrl: 'app/sites/{list_view_html_filename}',
    controller: '{list_view_js_controller_name} as vm'
}).state('{entity_plural_name}', {
    url: '/{entity_plural_name}/:id',
    templateUrl: 'app/sites/{details_view_html_filename}',
    controller: '{details_view_js_controller_name} as vm'
})