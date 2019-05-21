const env = require('../config/environment');

const log = info => {
    if (env.log.enabled) {
        console.log(info);
    }
};

const info = info => {
    if (env.log.enabled) {
        console.log(info);
    }
};

let error = (info) => {
    if (env.log.enabled) {
        console.error(info);
    }
}

let warn = (info) => {
    if (env.log.enabled) {
        console.warn(info);
    }
}

module.exports = {
    log: log,
    info: info,
    error: error,
    warn: warn
}