function generateModel(cb) {
    console.log('Generating model...');

    cb();
}

function generateController(cb) {
    console.log('Generating controller...');

    cb();
}

function generateRoute(cb) {
    console.log('Generating route...');

    cb();
}

module.exports = {
    generateModel: generateModel,
    generateController: generateController,
    generateRoute: generateRoute
};