import chalk from 'chalk';
import { getOrExec, prettyPrint } from './utils';

const defaultOptions = {
    transport: console,
    levels: [
        'verbose',
        'info',
        'warn',
        'error',
    ],
    messageFormatter: info => `${info.timestamp} ${info.level} [${info.name}] - ${info.message}`,
    levelFormatter: (level, index) => {
        const color = [chalk.cyan, chalk.green, chalk.yellow, chalk.red][index] || chalk.white;
        return color(level.substring(0, 4).toUpperCase());
    },
    nameFormatter: chalk.bold,
    level: 'verbose',
};

class Logger {

    constructor(name, options) {
        this.name = name;
        _.assign(this, _.defaults(options, defaultOptions));
        this.levelIndex = this._getLevelIndex(this.level);

        this.levels.forEach((level) => {
            this[level] = this.log.bind(this, level);
        });
    }

    log(level, ...message) {
        const levelIndex = this._getLevelIndex(level);
        if (levelIndex < this.levelIndex) {
            return;
        }

        const info = {
            timestamp: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            name: this.nameFormatter(getOrExec(this.name)),
            level: this.levelFormatter(level, levelIndex),
            message: message.map(prettyPrint).join(' '),
        };
        this.transport.log(this.messageFormatter(info));
    }

    _getLevelIndex(level) {
        const index = _.indexOf(this.levels, level);
        if (index < 0) {
            throw new Error(`Level ${level} must be in ${this.levels}`);
        }

        return index;
    }
}

export function setDefaults(options) {
    _.assign(defaultOptions, options);
}

export function getLogger(name, options) {
    return new Logger(name, options);
}

const defaultLogger = new Logger('logger', defaultOptions);
export default defaultLogger;
