'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(tasks) {
        var _this = this;

        var logger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _logger2.default;

        _classCallCheck(this, _class);

        _lodash2.default.forEach(tasks, function (task, name) {
            _this[name] = _this._append.bind(_this, task);
        });

        this.tasks = [];
        this.logger = logger;
    }

    _createClass(_class, [{
        key: '_append',
        value: function _append(task) {
            var _this2 = this;

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            this.tasks.push(function () {
                return task.apply(_this2, args);
            });
            return this;
        }
    }, {
        key: 'execute',
        value: function execute() {
            var promise = this.tasks[0]();
            this.tasks.slice(1).forEach(function (t) {
                promise = promise.then(t);
            });
            return promise.catch(this.logger.error);
        }
    }]);

    return _class;
}();

exports.default = _class;