var fs = require('fs');
var path = require('path');

function readTemplate(folder, filename) {
    var content = '',
        filePath = path.join(folder, filename);
    
    if (fs.existsSync(filePath)) {
        content = fs.readFileSync(filePath, 'utf8');
    }
    
    return content;
}

function writeFile(filePath, fileName, content) {
    var outputPath = path.join(__dirname, '..', 'output', filePath);

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    fs.writeFileSync(outputPath +  fileName, content, 'utf-8');
}

module.exports = {
    readTemplate: readTemplate,
    writeFile: writeFile
};