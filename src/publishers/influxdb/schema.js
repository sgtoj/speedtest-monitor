const Influx = require("influx");

const modelName = "net_speedtest_results";
const schemaModel = {
    measurement: modelName,
    fields: {
        download: Influx.FieldType.INTEGER,
        upload: Influx.FieldType.INTEGER,
        ping: Influx.FieldType.INTEGER
    },
    tags: [ "server", "location" ]
};

// exports

exports.model = schemaModel;
exports.name = modelName;
