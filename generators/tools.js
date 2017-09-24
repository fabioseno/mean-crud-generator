var fs = require('fs');
var path = require('path');

function readTemplate(folder, filename) {
    var content = '',
        filePath = path.join(__dirname, '..', 'templates', folder, filename);
    
    if (fs.existsSync(filePath)) {
        content = fs.readFileSync(filePath, 'utf8');
    }
    
    return content;
}

function writeFile(filename, content) {
    var filePath = path.join(__dirname, '..', 'output', filename);

    if (!fs.existsSync('./output')) {
        fs.mkdirSync('./output');
    }

    fs.writeFileSync(filePath, content, 'utf-8');
}

module.exports = {
    readTemplate: readTemplate,
    writeFile: writeFile
};