const log = require("../../commons/logger").logger;
const schema = require("./schema");
const Influx = require("influx");

// state

let client;

// public

function setup(options) {
    const configuration = {
        database: options.db || "speedtest",
        host: options.host,
        port: options.port || 8086,
        schemas: [ schema.SCHEMA_MODEL ]
    };
    if (options.user && options.pass) {
        configuration.username = options.user;
        configuration.password = options.pass;
    }
    client  = new Influx.InfluxDB(configuration);
}

async function handler(data) {
    const model = format(data);
    await client.writePoints([ model ]);
}

// private

function format(data) {
    return {
        measurement: schema.name,
        fields: {
            download: data.metric.download,
            upload: data.metric.upload,
            ping: data.metric.ping
        },
        tags: {
            server: data.meta.host,
            location: data.meta.location,
            country: data.meta.country
        }
    };
}

// exports

exports.handler = handler;
exports.setup = setup;
