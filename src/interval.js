if (!Promise.prototype.finally) {
    // eslint-disable-next-line no-extend-native
    Promise.prototype.finally = function always(onResolveOrReject) {
        return this.then(onResolveOrReject, onResolveOrReject);
    };
}

export default class Interval {

    constructor(interval) {
        this.interval = interval;
        this.baseline = undefined;
        this.timer = null;
    }

    start() {
        if (this.isRunning) return;

        if (this.onstart) this.onstart();

        this.baseline = Date.now();
        this._tick();
    }

    stop() {
        if (!this.isRunning) return;

        if (this.onstop) this.onstop();

        clearTimeout(this.timer);
        this.timer = null;
    }

    get isRunning() {
        return this.timer !== null;
    }

    _tick() {
        Promise.resolve(this.run())
            .finally(() => {
                const now = Date.now();

                while (this.baseline <= now) {
                    this.baseline += this.interval;
                }

                const nextTick = this.baseline - now;
                this.timer = setTimeout(() => {
                    if (this.isRunning) {
                        this._tick();
                    }
                }, nextTick);
            });
    }
}
