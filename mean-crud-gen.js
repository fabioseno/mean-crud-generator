#!/usr/bin/env node
var program = require('commander');
var fs = require('fs');
var os = require('os');
var scaffold = require('./generators/mean-2.0');

program
    .arguments('<file>')
    .action(function (file) {
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }

            var config = JSON.parse(data);

            console.log(os.EOL);

            scaffold.generate(config);
        });
    })
    .parse(process.argv);