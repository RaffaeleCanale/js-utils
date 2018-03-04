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
        this.baseline = null;
        this.timer = null;
    }

    _createClass(Interval, [{
        key: "start",
        value: function start() {
            if (this.isRunning) return;

            if (this.onstart) this.onstart.apply(this, arguments);

            this._scheduleTick();
        }
    }, {
        key: "stop",
        value: function stop() {
            if (!this.isRunning) return;

            if (this.onstop) this.onstop.apply(this, arguments);

            clearTimeout(this.timer);
            this.timer = null;
        }
    }, {
        key: "_tick",
        value: function _tick() {
            var _this = this;

            Promise.resolve(this.run()).finally(function () {
                if (_this.isRunning) {
                    _this._scheduleTick();
                }
            });
        }
    }, {
        key: "_scheduleTick",
        value: function _scheduleTick() {
            var _this2 = this;

            var now = Date.now();

            if (this.baseline === null) {
                this.baseline = now;
            } else {
                while (this.baseline <= now) {
                    this.baseline += this.interval;
                }
            }

            var nextTick = this.baseline - now;
            this.timer = setTimeout(function () {
                if (_this2.isRunning) {
                    _this2._tick();
                }
            }, nextTick);
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