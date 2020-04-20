var path = require('path');
var fs = require('fs');

function readTemplate(folder, filename) {
    var content = '',
        filePath = path.join(folder, filename);

    if (fs.existsSync(filePath)) {
        content = fs.readFileSync(filePath, 'utf8');
    }

    return content;
}

function writeFile(sourceFolder, subFolder, fileName, content) {
    var outputPath = path.join('output', sourceFolder, subFolder);

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    let filePath = path.join(outputPath, fileName);

    fs.writeFileSync(filePath, content, 'utf-8');

    return filePath;
}

module.exports = {
    readTemplate,
    writeFile
};