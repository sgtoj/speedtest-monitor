// enum

const levels = {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warn: 4,
    notice: 5,
    info: 6,
    debug: 7
};

// private

class LogProxy {
    constructor() {
        this.client = new DefaultLogger();
    }

    set handler(value) {
        this.client = value;
    }

    set level(value) {
        this.client.level = value;
    }

    debug(msg) {
        this.client.debug(msg);
    }

    error(err) {
        let msg = err instanceof Error && err.stack ? `${err.message}\n${err.stack}` : err;
        this.client.error(msg);
    }

    info(msg) {
        this.client.info(msg);
    }

    log(msg) {
        this.client.info(msg);
    }
}

class DefaultLogger {

    constructor() {
        this.threshold = levels.debug;
    }

    set level(value) {
        this.threshold = levels[value] || levels.debug;
    }

    debug(msg) {
        if (this.threshold < levels.debug) return;
        this.log(console.debug, this.format("DEBUG", msg));
    }

    error(msg) {
        if (this.threshold < levels.error) return;
        this.log(console.error, this.format("ERROR", msg));
    }

    info(msg) {
        if (this.threshold < levels.info) return;
        this.log(console.log, this.format("INFO", msg));
    }

    format(level, msg) {
        return `${level}: ${msg}`;
    }

    log(fn, msg) {
        try {
            fn(msg);
        } catch (e) {
            // ignore any errors
        }
    }

}

// exports

exports.logger = new LogProxy();