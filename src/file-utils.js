import fs from 'fs';
import path from 'path';

export function readJson(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) return reject(err);

            try {
                return resolve(JSON.parse(data));
            } catch (e) {
                return reject(new Error(`Cannot JSON parse data: ${e}`));
            }
        });
    });
}

export function readJsonSync(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function writeJson(file, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, 'utf8', (err) => {
            if (err) return reject(err);
            return resolve();
        });
    });
}


export function readToArray(file) {
    return new Promise((resolve, reject) => {
        return fs.readFile(file, (err, data) => {
            if (err) return reject(err);

            const array = data.toString().split('\r\n');
            return resolve(array);
        });
    });
}

export function writeArray(file, array) {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, array.join('\n'), 'utf8', (err) => {
            if (err) return reject(err);
            return resolve();
        });
    });
}

export function walkSync(dir) {
    let result = [];
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        file = path.resolve(dir, file);

        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            result = result.concat(walkSync(file));
        } else {
            result.push(file);
        }
    });

    return result;
}
