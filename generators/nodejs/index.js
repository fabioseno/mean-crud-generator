var os = require('os');
var backend = require('./backend-generator');

function generate(config, database) {
    if (database === 'MongoDB') {
        backend.generateModel(config);
    }

    switch (database) {
        case 'MongoDB':
            backend.generateControllerMongo(config);
            backend.generateDomainMongoDB(config);
            break;
        case 'MySQL':
            backend.generateControllerMySQL(config);
            backend.generateDomainMySQL(config);
            break;
    }

    backend.generateMiddleware(config);
    backend.generateRoute(config);
    backend.generateIndex(config);

    console.log('Finished generating backend files' + os.EOL);
}

module.exports = {
    generate
};