const log = require("./commons/logger").logger;
const speedtest = require("speedtest-net");

// state

let config = {};

// public

function setup(options) {
    config = options || {};
}

async function poll() {
    const results = await test();
    return transform(results);
}

// private

async function test() {
    return new Promise((resolve, reject) => {
        log.info("Running testing...");
        const instance = speedtest(config);
        instance.on("data", data => {
            resolve(data);
        });
        instance.on("error", err => {
            reject(err);
        });

        instance.on("testserver", svr => {
            log.debug(`speedtest server: ${JSON.stringify(svr)}`);
        });
        instance.on("downloadprogress", stat => {
            log.debug(`download progess: ${stat}`);
        });
        instance.on("uploadprogress", stat => {
            log.debug(`upload progess: ${stat}`);
        });
    });
}

function transform(model) {
    return {
        metric: {
            download: model.speeds.download,
            upload: model.speeds.upload,
            ping: model.server.ping
        },
        meta: {
            host: model.server.host,
            location: model.server.location,
            county: model.server.cc
        }
    };
}

// exports

exports.setup = setup;
exports.poll = poll;