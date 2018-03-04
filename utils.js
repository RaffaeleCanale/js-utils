'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getRandomSample = getRandomSample;
exports.filterAll = filterAll;
exports.findBy = findBy;
exports.findIndex = findIndex;
exports.findIndexBy = findIndexBy;
exports.contains = contains;
exports.containsBy = containsBy;
exports.mod = mod;
exports.byteSize = byteSize;
exports.getOrExec = getOrExec;
exports.reverseLookup = reverseLookup;
exports.prettyPrint = prettyPrint;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getRandomSample(arr, size) {
    if (size >= arr.length) {
        return arr;
    }

    var shuffled = arr.slice(0);
    var i = arr.length;
    var min = i - size;
    var temp = void 0;
    var index = void 0;

    // eslint-disable-next-line no-plusplus
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

function filterAll(arr, filters) {
    return arr.filter(function (e) {
        return _lodash2.default.every(filters, function (f) {
            return f(e);
        });
    });
}

function findBy(arr, element, field) {
    return arr.find(function (e) {
        return e[field] === element[field];
    });
}

function findIndex(arr, predicate) {
    return _lodash2.default.findIndex(arr, predicate);
}

function findIndexBy(arr, element, field) {
    return _lodash2.default.findIndex(arr, function (e) {
        return e[field] === element[field];
    });
}

function contains(arr, element) {
    return findIndex(arr, function (e) {
        return e === element;
    }) >= 0;
}

function containsBy(arr, element, field) {
    return findIndexBy(arr, element, field) >= 0;
}

function mod(n, m) {
    var remain = n % m;
    return Math.floor(remain >= 0 ? remain : remain + m);
}

function byteSize(data) {
    if (_lodash2.default.isString(data)) {
        return Buffer.byteLength(data, 'utf8');
    }
    return data.byteLength;
}

function getOrExec(obj, args) {
    if (_lodash2.default.isFunction(obj)) {
        if (!args) {
            return obj();
        }
        return obj.apply(undefined, _toConsumableArray(args));
    }
    return obj;
}

function reverseLookup(obj, field) {
    return _lodash2.default.invert(obj)[field];
}

function prettyPrint(value) {
    if (_lodash2.default.isArray(value)) {
        return '[' + value.map(prettyPrint).join(', ') + ']';
    } else if (_lodash2.default.isPlainObject(value)) {
        return JSON.stringify(value);
    }

    return value;
}