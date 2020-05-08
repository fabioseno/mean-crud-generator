var angularjs = require('./angularjs');
var angular = require('./angular');
var nodejs = require('./nodejs');

// function getGenerator(type) {
//     if (type === 'mean') {
//         return mean;
//     } else {
//         return mean2;
//     }
// }

const frontEndTech = {
    AngularJS: 'AngularJS',
    Angular: 'Angular'
};

const backendTech = {
    NodeJS: 'NodeJS'
};

const database = {
    MySQL: 'MySQL',
    MongoDB: 'MongoDB'
};

function generate(config, options) {
    if (options.backendTech === backendTech.NodeJS) {
        nodejs.generate(config, options.database);
    }

    if (options.frontendTech === frontEndTech.AngularJS) {
        angularjs.generate(config);
    } else {
        angular.generate(config);
    }
}

module.exports = {
    frontEndTech,
    backendTech,
    database,
    generate
};