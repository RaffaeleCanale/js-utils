'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.readJson = readJson;
exports.writeJson = writeJson;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function readJson(file) {
    return new Promise(function (resolve, reject) {
        _fs2.default.readFile(file, 'utf8', function (err, data) {
            if (err) return reject(err);

            try {
                return resolve(JSON.parse(data));
            } catch (e) {
                return reject(new Error('Cannot JSON parse data: ' + e));
            }
        });
    });
}

function writeJson(file, data) {
    return new Promise(function (resolve, reject) {
        _fs2.default.writeFile(file, data, 'utf8', function (err) {
            if (err) return reject(err);
            return resolve();
        });
    });
}
