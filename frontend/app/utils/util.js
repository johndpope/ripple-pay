exports.truncate = function(num, decimalPlaces) {
    if (!num && num !== 0) {
      return "";  
    }
    const numString = num.toString();
    const regexString = `^-?\\d+(?:\\.\\d{0,${decimalPlaces}})?`;
    const reg = new RegExp(regexString, 'i');
    return numString.match(reg)[0];
};

exports.sanitize = function(input, type, maxLength) {
    if (typeof input !== type) {
        return false;
    }
    if (input.toString().length > maxLength) {
        return false;
    }
    return true;
};

exports.validRippleAddress = function(string) {
    return string.match(/^r[1-9A-HJ-NP-Za-km-z]{25,34}$/);
};

exports.validMoneyEntry = function(amount) {
    const amountString = amount.toString();
    return parseFloat(amount) && parseFloat(amount) > 0 && amountString.match(/\d+/);
};

// note: this will mess up the original ordering of the keys
exports.convertArrayOfObjectsToObject = function(array, extractKey, makeKeyUpperCase=false) {
    const result = {};
    array.forEach((obj) => {
        let key = obj[extractKey];
        if (makeKeyUpperCase) {
            key = key.toUppserCase();
        }
        result[key] = obj;
    });
    return result;
};

exports.isEmpty = function(obj) {
    return Object.keys(obj).length === 0;
};