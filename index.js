#!/usr/bin/env node
var program = require('commander');
var fs = require('fs');
var os = require('os');
// var scaffold = require('./generators/mean-2.0');
var generatorFactory = require('./generators/generator-factory');

// example
// node index.js -f file.json
// node index.js -p metadata/test

program
    .option('-p --path <path>', 'specify path to folder containing multiple metadata files')
    .option('-f --file <file>', 'specify single file to be processed');

program.parse(process.argv);

var processFile = (file, sourcePath) => {
    fs.readFile(file, 'utf8', function (err, file) {
        if (err) {
            return console.log(err);
        }

        var config = JSON.parse(file);

        config.sourcePath = sourcePath;

        let options = {
            database: generatorFactory.database.MongoDB,
            frontendTech: generatorFactory.frontEndTech.Angular,
            backendTech: generatorFactory.backendTech.NodeJS
        }

        generatorFactory.generate(config, options);
    });
}

if (program.file) {
    processFile(program.file, '/');
} else if (program.path) {
    fs.readdir(program.path, (err, files) => {
        if (err) {
            return console.log(err);
        }

        for (let i = 0; i < files.length; i++) {
            let file = files[i];

            if (file !== '.DS_Store') {
                processFile(program.path + '/' + files[i], program.path);
            }
        }

    });
}