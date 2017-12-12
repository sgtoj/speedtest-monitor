const log = require("./commons/logger").logger;
const sleep = require("./commons/functions").sleep;

// enum

const State = {
    STOP: "STOP",
    STOPPING: "STOPPING",
    RUNNING: "RUNNING"
};

// state

let state = State.STOP;
let config = {
    subj: null,
    subs: [],
    opts: {}
};

// public

function setup(subject, subscribers, options) {
    config.subj = subject;
    config.subs = Array.isArray(subscribers) ? subscribers : [ subscribers ];
    config.opts = options || {};
}

function start() {
    state = State.RUNNING;
    loop();
}

function stop() {
    state = State.STOPPING;
}

async function waitForStop() {
    if (state === State.STOP) return;
    log.info("Waiting for monitor to stop.");
    await sleep(1000);
    await waitForStop();
}

// private

async function loop() {
    const timeout = (config.opts.delay || 0) * 1000;
    while (state === State.RUNNING) {
        await execute(config.subj, config.subs);
        await sleep(timeout);
    }
    state = State.STOP;
}

async function execute(subject, subscribers) {
    const data = await poll(subject);
    await publish(subscribers, data);

}

async function poll(subject) {
    log.debug("polling subject...");
    let results = null;
    try {
        results = await subject.poll();
    } catch (err) {
        log.error(err);
    }
    return results;
}

async function publish(subscribers, data) {
    log.debug("publishing data...");
    const calls = subscribers.map(async subscriber => {
        try {
            await subscriber.handler(data);
        } catch (err) {
            log.error(err);
        }
    });
    await Promise.all(calls);
}

// exports

exports.setup = setup;
exports.start = start;
exports.stop = stop;
exports.waitForStop = waitForStop;