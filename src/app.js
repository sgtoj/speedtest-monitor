const log = require("./commons/logger").logger;
const configuration = require("./commons/configuration");
const publishers = require("./publishers/publishers");
const monitor = require("./monitor");
const speedtest = require("./speedtest");

// state

let opts = {};
let subs = [];

// public

async function launch(options) {
    await load(options);
    monitor.start();
    return Promise.resolve(monitor);
}

async function load(options) {
    opts = await configuration.load(options);
    subs = await publishers.get(opts.publishers);
    log.level = (opts.logging || {}).level || "info";
    speedtest.setup(opts.speedtest);
    monitor.setup(speedtest, subs, opts.monitor);
    process.on("SIGTERM", onTerminate);
}

async function onTerminate() {
    log.info("Stopping monitor due to SIGTERM signal!");
    monitor.stop();
    await monitor.waitForStop();
}

exports.launch = launch;