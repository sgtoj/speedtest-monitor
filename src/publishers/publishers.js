const list = {
    "influxdb": require("./influxdb/influxdb"),
    "simple": require("./simple/simple")
};

// public

function get (params) {
    return params.map(param => {
        let publisher = list[param.type];
        if (!publisher) throw new Error(`Unknown consumer type: ${param.type}`);
        publisher.setup(param.options);
        return publisher;
    });
}

// exports

exports.get = get;