function convertArrayToObject(array, key){
    const initialValue = {};
    return array.reduce((obj, item) => {
        return {
        ...obj,
        [item[key]]: item,
        };
    }, initialValue);
};

function checkDifferences(object1, object2, keysToIgnore) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        if (keysToIgnore.includes(key)) continue;
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (areObjects) continue;
        else if (val1 !== val2) {
            return false;
        }
    }

    return true;
}

function getDifferences(object1, object2, keysToIgnore) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    const differences = {};

    for (const key of keys1) {
        if (keysToIgnore.includes(key)) continue;
        const val1 = object1[key];
        const val2 = object2[key];
        if (isObject(val1) && isObject(val2)) continue;
        else if (val1 !== val2) {
            differences[key] = val1;
        }
    }

    return differences;
}

function isObject(object) {
    return object != null && typeof object === 'object';
}

function removeKeys(obj, keys) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            switch (typeof obj[prop]) {
                case 'object':
                    if (keys.indexOf(prop) > -1) {
                        delete obj[prop];
                    } else {
                        removeKeys(obj[prop], keys);
                    }
                    break;
            default:
                    if (keys.indexOf(prop) > -1) {
                        delete obj[prop];
                    }
                    break;
            }
        }
    }
}
export { checkDifferences, getDifferences, removeKeys, convertArrayToObject };
