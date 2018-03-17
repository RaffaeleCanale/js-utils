'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.setDefaults = setDefaults;
exports.getLogger = getLogger;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultOptions = {
    transport: console,
    levels: ['verbose', 'info', 'warn', 'error'],
    messageFormatter: function messageFormatter(info) {
        return info.timestamp + ' ' + info.level + ' [' + info.name + '] - ' + info.message;
    },
    levelFormatter: function levelFormatter(level, index) {
        var color = [_chalk2.default.cyan, _chalk2.default.green, _chalk2.default.yellow, _chalk2.default.red][index] || _chalk2.default.white;
        return color(level.substring(0, 4).toUpperCase());
    },
    nameFormatter: _chalk2.default.bold,
    level: 'verbose'
};

function formatDate(date) {
    var pad = function pad(num) {
        var norm = Math.floor(Math.abs(num));
        return (norm < 10 ? '0' : '') + norm;
    };
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
}

var Logger = function () {
    function Logger(name, options) {
        var _this = this;

        _classCallCheck(this, Logger);

        this.name = name;
        _lodash2.default.assign(this, _lodash2.default.defaults(options, defaultOptions));
        this.levelIndex = this._getLevelIndex(this.level);

        this.levels.forEach(function (level) {
            _this[level] = _this.log.bind(_this, level);
        });
    }

    _createClass(Logger, [{
        key: 'log',
        value: function log(level) {
            var levelIndex = this._getLevelIndex(level);
            if (levelIndex < this.levelIndex) {
                return;
            }

            for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                message[_key - 1] = arguments[_key];
            }

            var info = {
                // timestamp: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                timestamp: formatDate(new Date()),
                name: this.nameFormatter((0, _utils.getOrExec)(this.name)),
                level: this.levelFormatter(level, levelIndex),
                message: message.map(_utils.prettyPrint).join(' ')
            };
            this.transport.log(this.messageFormatter(info));
        }
    }, {
        key: '_getLevelIndex',
        value: function _getLevelIndex(level) {
            var index = _lodash2.default.indexOf(this.levels, level);
            if (index < 0) {
                throw new Error('Level ' + level + ' must be in ' + this.levels);
            }

            return index;
        }
    }]);

    return Logger;
}();

function setDefaults(options) {
    _lodash2.default.assign(defaultOptions, options);
}

function getLogger(name, options) {
    return new Logger(name, options);
}

var defaultLogger = new Logger('logger', defaultOptions);
exports.default = defaultLogger;