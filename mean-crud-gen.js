#!/usr/bin/env node
var program = require('commander');
var fs = require('fs');

program
    .arguments('<file>')
    .action(function (file) {
        console.log('Reading files...');
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
        });
    })
    .parse(process.argv);