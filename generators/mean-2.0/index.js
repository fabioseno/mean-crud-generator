var async = require('async');
var os = require('os');
var backend = require('./backend-generator');
var frontend = require('./frontend-generator');

function generate(config) {
    async.parallel([
        function (cb) {
            backend.generateModel(config, cb);
        }, function (cb) {
            backend.generateController(config, cb);
        }, function (cb) {
            backend.generateDomain(config, cb);
        }, function (cb) {
            backend.generateMiddleware(config, cb);
        }, function (cb) {
            backend.generateRoute(config, cb);
        }
    ], function (err, results) {
        console.log('Finished generating backend files' + os.EOL);
    });

    async.parallel([
        function (cb) {
            frontend.generateListViewHtml(config, cb);
        }, function (cb) {
            frontend.generateListViewStyle(config, cb);
        }, function (cb) {
            frontend.generateListViewLogic(config, cb);
        }, function (cb) {
            frontend.generateDetailsViewHtml(config, cb);
        }, function (cb) {
            frontend.generateDetailsViewStyle(config, cb);
        }, function (cb) {
            frontend.generateDetailsViewLogic(config, cb);
        }, function (cb) {
            frontend.generateUIRoutes(config, cb);
        }
    ], function (err, results) {
        console.log('Finished generating frontend files' + os.EOL);
    });
}

module.exports = {
    generate: generate
};