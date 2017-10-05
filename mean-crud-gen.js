#!/usr/bin/env node
var program = require('commander');
var fs = require('fs');
var os = require('os');
var async = require('async');
var backend = require('./generators/backend-generator');
var frontend = require('./generators/frontend-generator');

program
    .arguments('<file>')
    .action(function (file) {
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }

            var config = JSON.parse(data);

            console.log(os.EOL);

            async.parallel([
                function (cb) {
                    backend.generateModel(config, cb);
                }, function (cb) {
                    backend.generateController(config, cb);
                }, function (cb) {
                    backend.generateRoute(config, cb);
                }, function (cb) {
                    backend.generateMiddlewares(config, cb);
                }
            ], function(err, results) {
                console.log('Finished generating backend files' + os.EOL);
            });

            async.parallel([
                function (cb) {
                    frontend.generateListViewHtml(config, cb);
                }, function (cb) {
                    frontend.generateListViewLogic(config, cb);
                }, function (cb) {
                    frontend.generateDetailsViewHtml(config, cb);
                }, function (cb) {
                    frontend.generateDetailsViewLogic(config, cb);
                }
            ], function(err, results) {
                console.log('Finished generating frontend files' + os.EOL);
            });
        });
    })
    .parse(process.argv);