export function getRandomSample(arr, size) {
    if (size >= arr.length) {
        return arr;
    }

    const shuffled = arr.slice(0);
    let i = arr.length;
    const min = i - size;
    let temp;
    let index;

    // eslint-disable-next-line no-plusplus
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

export function filterAll(arr, filters) {
    return arr.filter(e => _.every(filters, f => f(e)));
}

export function findBy(arr, element, field) {
    return arr.find(e => e[field] === element[field]);
}

export function findIndex(arr, predicate) {
    return _.findIndex(arr, predicate);
}

export function findIndexBy(arr, element, field) {
    return _.findIndex(arr, e => e[field] === element[field]);
}

export function contains(arr, element) {
    return findIndex(arr, e => e === element) >= 0;
}

export function containsBy(arr, element, field) {
    return findIndexBy(arr, element, field) >= 0;
}

export function mod(n, m) {
    const remain = n % m;
    return Math.floor(remain >= 0 ? remain : remain + m);
}

export function byteSize(data) {
    if (_.isString(data)) {
        return Buffer.byteLength(data, 'utf8');
    }
    return data.byteLength;
}

export function getOrExec(obj, args) {
    if (_.isFunction(obj)) {
        if (!args) {
            return obj();
        }
        return obj(...args);
    }
    return obj;
}

export function reverseLookup(obj, field) {
    return _.invert(obj)[field];
}

export function prettyPrint(value) {
    if (_.isArray(value)) {
        return `[${value.map(prettyPrint).join(', ')}]`;
    } else if (_.isPlainObject(value)) {
        return JSON.stringify(value);
    }

    return value;
}
