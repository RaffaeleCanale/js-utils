import fs from 'fs';
import path from 'path';

export function readJson(file, charset = 'utf8') {
    return new Promise((resolve, reject) => {
        fs.readFile(file, charset, (err, data) => {
            if (err) return reject(err);

            try {
                return resolve(JSON.parse(data));
            } catch (e) {
                return reject(new Error(`Cannot JSON parse data: ${e}`));
            }
        });
    });
}

export function readJsonSync(file, charset = 'utf8') {
    return JSON.parse(fs.readFileSync(file, charset));
}

export function writeJson(file, data, charset = 'utf8') {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, charset, (err) => {
            if (err) return reject(err);
            return resolve();
        });
    });
}


export function readToArray(file, charset = 'utf8', cr = '\n') {
    return new Promise((resolve, reject) => {
        return fs.readFile(file, charset, (err, data) => {
            if (err) return reject(err);

            const array = data.toString().split(cr);
            return resolve(array);
        });
    });
}

export function writeArray(file, array, charset = 'utf8') {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, array.join('\n'), charset, (err) => {
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
