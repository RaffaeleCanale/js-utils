"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (!Promise.prototype.finally) {
    // eslint-disable-next-line no-extend-native
    Promise.prototype.finally = function always(onResolveOrReject) {
        return this.then(onResolveOrReject, onResolveOrReject);
    };
}

var Interval = function () {
    function Interval(interval) {
        _classCallCheck(this, Interval);

        this.interval = interval;
        this.baseline = undefined;
        this.timer = null;
    }

    _createClass(Interval, [{
        key: "start",
        value: function start() {
            if (this.isRunning) return;

            if (this.onstart) this.onstart();

            this.baseline = Date.now();
            this._tick();
        }
    }, {
        key: "stop",
        value: function stop() {
            if (!this.isRunning) return;

            if (this.onstop) this.onstop();

            clearTimeout(this.timer);
            this.timer = null;
        }
    }, {
        key: "_tick",
        value: function _tick() {
            var _this = this;

            Promise.resolve(this.run()).finally(function () {
                var now = Date.now();

                while (_this.baseline <= now) {
                    _this.baseline += _this.interval;
                }

                var nextTick = _this.baseline - now;
                _this.timer = setTimeout(function () {
                    if (_this.isRunning) {
                        _this._tick();
                    }
                }, nextTick);
            });
        }
    }, {
        key: "isRunning",
        get: function get() {
            return this.timer !== null;
        }
    }]);

    return Interval;
}();

exports.default = Interval;