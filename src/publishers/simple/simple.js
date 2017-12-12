const Buffer = require("buffer").Buffer;
const log = require("../../commons/logger").logger;

// enum

const otype = {
    stdout: "stdout",
    log: "log"
};

const ftype = {
    json: "json",
    string: "string"
};

// state

const config = {
    format: ftype.json,
    output: otype.log
};

// public

function setup(options) {
    options = options || {};
    config.format = ftype[options.format] || ftype.json;
    config.output = otype[options.output] || otype.log;
}

async function handler(data) {
    let model = transform(data);
    publish(model);
}

// private

function publish(data) {
    if (config.output === otype.log) {
        log.info(data);
    } else {
        let buffer = new Buffer(data);
        process.stdout.write(buffer);
    }
}

function transform(data) {
    let model = {
        down: data.metric.download,
        up: data.metric.upload,
        ping: data.metric.ping,
        host: data.meta.host,
        location: data.meta.location
    };

    let output = "";
    if (config.format === ftype.json) {
        output = JSON.stringify(model, null, 0);
    } else {
        const m = model;
        output = `upload="${m.up}" download="${m.down}" ping="${m.ping}" host="${m.host}" location="${m.location}"`;
    }

    return output;
}

// exports

exports.handler = handler;
exports.setup = setup;
