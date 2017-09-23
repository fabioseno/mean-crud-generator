function generateListViewHtml(cb) {
    console.log('Generating list view HTML...');

    cb();
}

function generateListViewLogic(cb) {
    console.log('Generating list view logic...');

    cb();
}

function generateDetailsViewHtml(cb) {
    console.log('Generating details view HTML...');

    cb();
}

function generateDetailsViewLogic(cb) {
    console.log('Generating details view logic...');

    cb();
}

module.exports = {
    generateListViewHtml: generateListViewHtml,
    generateListViewLogic: generateListViewLogic,
    generateDetailsViewHtml: generateDetailsViewHtml,
    generateDetailsViewLogic: generateDetailsViewLogic
};