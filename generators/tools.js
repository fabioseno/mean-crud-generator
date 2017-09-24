var fs = require('fs');
var path = require('path');

function readTemplate(folder, filename) {
    return fs.readFileSync(path.join(__dirname, '..', 'templates', folder, filename), 'utf8');
}

module.exports = {
    readTemplate: readTemplate
};