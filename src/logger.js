import _ from 'lodash';
import chalk from 'chalk';
import { getOrExec, prettyPrint } from './utils';

function formatDate(date) {
    const pad = (num) => {
        const norm = Math.floor(Math.abs(num));
        return (norm < 10 ? '0' : '') + norm;
    };
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

const defaultLevels = [
    'verbose',
    'info',
    'warn',
    'error',
];

const defaultTransport = {
    log: console.log,
    dateFormatter: formatDate,
    messageFormatter: info => `${info.timestamp} ${info.level} [${info.name}] - ${info.message}`,
    levelFormatter: (level, index) => {
        const color = [chalk.cyan, chalk.green, chalk.yellow, chalk.red][index] || chalk.white;
        return color(level.substring(0, 4).toUpperCase());
    },
    nameFormatter: chalk.bold,
    level: 'verbose',
};

class Logger {

    constructor(name, transports, levels) {
        this.levels = levels || defaultLevels;
        this.name = name;
        this.transports = transports.map((transport) => {
            const options = _.defaults(transport, defaultTransport);
            options.levelIndex = this._getLevelIndex(options.level);
            return options;
        });

        levels.forEach((level) => {
            this[level] = this.log.bind(this, level);
        });
    }

    log(level, ...message) {
        const levelIndex = this._getLevelIndex(level);
        if (levelIndex < this.levelIndex) {
            return;
        }

        this.transports.forEach((transport) => {
            const info = {
                timestamp: transport.dateFormatter(new Date()),
                name: transport.nameFormatter(getOrExec(this.name)),
                level: transport.levelFormatter(level, levelIndex),
                message: message.map(prettyPrint).join(' '),
            };
            transport.log(this.messageFormatter(info));
        });
    }

    _getLevelIndex(level) {
        const index = _.indexOf(this.levels, level);
        if (index < 0) {
            throw new Error(`Level ${level} must be in ${this.levels}`);
        }

        return index;
    }
}

let globalTransports = [defaultTransport];

export function setDefaultTransports(transports) {
    globalTransports = transports;
}

export function getLogger(name, transports, levels) {
    return new Logger(name, transports || globalTransports, levels || defaultLevels);
}

export default Logger;
