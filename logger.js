'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.setDefaultTransports = setDefaultTransports;
exports.getLogger = getLogger;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function formatDate(date) {
    var pad = function pad(num) {
        var norm = Math.floor(Math.abs(num));
        return (norm < 10 ? '0' : '') + norm;
    };
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
}

var defaultLevels = ['verbose', 'info', 'warn', 'error'];

var defaultTransport = {
    log: console.log,
    processMessage: function processMessage() {
        for (var _len = arguments.length, message = Array(_len), _key = 0; _key < _len; _key++) {
            message[_key] = arguments[_key];
        }

        return message.map(_utils.prettyPrint).join(' ');
    },
    dateFormatter: formatDate,
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

var Logger = function () {
    function Logger(name, transports, levels) {
        var _this = this;

        _classCallCheck(this, Logger);

        this.levels = levels || defaultLevels;
        this.name = name;
        this.transports = transports.map(function (transport) {
            var options = _lodash2.default.defaults(transport, defaultTransport);
            options.levelIndex = _this._getLevelIndex(options.level);
            return options;
        });

        levels.forEach(function (level) {
            _this[level] = _this.log.bind(_this, level);
        });
    }

    _createClass(Logger, [{
        key: 'log',
        value: function log(level) {
            var _this2 = this;

            for (var _len2 = arguments.length, message = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                message[_key2 - 1] = arguments[_key2];
            }

            var levelIndex = this._getLevelIndex(level);

            this.transports.forEach(function (transport) {
                if (levelIndex < transport.levelIndex) {
                    return;
                }
                var info = {
                    timestamp: transport.dateFormatter(new Date()),
                    name: transport.nameFormatter((0, _utils.getOrExec)(_this2.name)),
                    level: transport.levelFormatter(level, levelIndex),
                    message: transport.processMessage.apply(transport, message)
                };
                transport.log(transport.messageFormatter(info));
            });
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

var globalTransports = [defaultTransport];

function setDefaultTransports(transports) {
    globalTransports = transports;
}

function getLogger(name, transports, levels) {
    return new Logger(name, transports || globalTransports, levels || defaultLevels);
}

exports.default = Logger;