var os = require('os');
var backend = require('./backend-generator');

function generate(config, database) {
    if (database !== 'MongoDB') {
        backend.generateModel(config);
    }

    backend.generateController(config);

    switch (database) {
        case 'MongoDB':
            backend.generateDomainMongoDB(config);
            break;
        case 'MySQL':
            backend.generateDomainMySQL(config);
            break;
    }

    backend.generateMiddleware(config);
    backend.generateRoute(config);

    console.log('Finished generating backend files' + os.EOL);
}

module.exports = {
    generate
};