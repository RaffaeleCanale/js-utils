import fs from 'fs';

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

export function writeJson(file, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, 'utf8', (err) => {
            if (err) return reject(err);
            return resolve();
        });
    });
}
