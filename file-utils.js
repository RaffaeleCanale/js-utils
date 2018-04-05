'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.readJson = readJson;
exports.readJsonSync = readJsonSync;
exports.writeJson = writeJson;
exports.readToArray = readToArray;
exports.writeArray = writeArray;
exports.walkSync = walkSync;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function readJson(file) {
    var charset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'utf8';

    return new Promise(function (resolve, reject) {
        _fs2.default.readFile(file, charset, function (err, data) {
            if (err) return reject(err);

            try {
                return resolve(JSON.parse(data));
            } catch (e) {
                return reject(new Error('Cannot JSON parse data: ' + e));
            }
        });
    });
}

function readJsonSync(file) {
    var charset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'utf8';

    return JSON.parse(_fs2.default.readFileSync(file, charset));
}

function writeJson(file, data) {
    var charset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'utf8';

    return new Promise(function (resolve, reject) {
        _fs2.default.writeFile(file, data, charset, function (err) {
            if (err) return reject(err);
            return resolve();
        });
    });
}

function readToArray(file) {
    var charset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'utf8';

    return new Promise(function (resolve, reject) {
        return _fs2.default.readFile(file, charset, function (err, data) {
            if (err) return reject(err);

            var array = data.toString().split('\r\n');
            return resolve(array);
        });
    });
}

function writeArray(file, array) {
    var charset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'utf8';

    return new Promise(function (resolve, reject) {
        _fs2.default.writeFile(file, array.join('\n'), charset, function (err) {
            if (err) return reject(err);
            return resolve();
        });
    });
}

function walkSync(dir) {
    var result = [];
    var files = _fs2.default.readdirSync(dir);

    files.forEach(function (file) {
        file = _path2.default.resolve(dir, file);

        var stat = _fs2.default.statSync(file);
        if (stat && stat.isDirectory()) {
            result = result.concat(walkSync(file));
        } else {
            result.push(file);
        }
    });

    return result;
}