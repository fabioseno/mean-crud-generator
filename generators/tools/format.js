function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function formatText(string, args) {
    for (var i = 1; i < arguments.length; i++) {
        string = string.replace(new RegExp('\\{' + (i - 1) + '\\}', 'g'), arguments[i]);
    }

    return string;
}

function setTabs(number) {
    var result = '';
    
    if (!isNaN(number)) {
        for (var i = 0; i < number; i++) {
            result += '\t';
        }
    }

    return result;
}

module.exports = {
    capitalize,
    formatText,
    setTabs
};