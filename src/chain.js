import DefaultLogger from './logger';
import _ from 'lodash';

export default class {

    constructor(tasks, logger = DefaultLogger) {
        _.forEach(tasks, (task, name) => {
            this[name] = this._append.bind(this, task);
        });

        this.tasks = [];
        this.logger = logger;
    }

    _append(task, ...args) {
        this.tasks.push(() => task.apply(this, args));
        return this;
    }

    execute() {
        let promise = this.tasks[0]();
        this.tasks.slice(1).forEach((t) => {
            promise = promise.then(t);
        });
        return promise.catch(this.logger.error);
    }
}
