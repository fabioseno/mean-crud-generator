function getDataType(dataType) {
    if (dataType === 'Integer' || dataType === 'Decimal') {
        return number;
    } else {
        return dataType;
    }
}

function getModelMetadata(config) {
    var result = '';
    var obj = {};

    for (var i = 0; i < config.fields.length; i++) {
        var field = config.fields[i];

        obj[field.fieldName] = {
            type: getDataType(field.dataType)
        }

        if (field.unique) {
            obj[field.fieldName].unique = true;
        }

        if (field.required) {
            obj[field.fieldName].required = true;
        }
    }

    return JSON.stringify(obj, null, '\t')
}

module.exports = {
    getModelMetadata: getModelMetadata
};