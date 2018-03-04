if (!Promise.prototype.finally) {
    // eslint-disable-next-line no-extend-native
    Promise.prototype.finally = function always(onResolveOrReject) {
        return this.then(onResolveOrReject, onResolveOrReject);
    };
}

export default class Interval {

    constructor(interval) {
        this.interval = interval;
        this.baseline = null;
        this.timer = null;
    }

    start(...args) {
        if (this.isRunning) return;

        if (this.onstart) this.onstart(...args);

        this._scheduleTick();
    }

    stop(...args) {
        if (!this.isRunning) return;

        if (this.onstop) this.onstop(...args);

        clearTimeout(this.timer);
        this.timer = null;
    }

    get isRunning() {
        return this.timer !== null;
    }

    _tick() {
        Promise.resolve(this.run())
            .finally(() => {
                if (this.isRunning) {
                    this._scheduleTick();
                }
            });
    }

    _scheduleTick() {
        const now = Date.now();

        if (this.baseline === null) {
            this.baseline = now;
        } else {
            while (this.baseline <= now) {
                this.baseline += this.interval;
            }
        }

        const nextTick = this.baseline - now;
        this.timer = setTimeout(() => {
            if (this.isRunning) {
                this._tick();
            }
        }, nextTick);
    }
}
