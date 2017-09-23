#!/usr/bin/env node
var program = require('commander');
var fs = require('fs');
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

            async.parallel([
                function (cb) {
                    backend.generateModel(cb);
                }, function (cb) {
                    backend.generateController(cb);
                }, function (cb) {
                    backend.generateRoute(cb);
                }, function (cb) {
                    frontend.generateListViewHtml(cb);
                }, function (cb) {
                    frontend.generateListViewLogic(cb);
                }, function (cb) {
                    frontend.generateDetailsViewHtml(cb);
                }, function (cb) {
                    frontend.generateDetailsViewLogic(cb);
                }
            ], function(err, results) {
                // optional callback
                console.log('Finished generating files');
            });
        });
    })
    .parse(process.argv);