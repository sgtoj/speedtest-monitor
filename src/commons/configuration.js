const fs = require("fs");
const yaml = require("js-yaml");

const CONFIG_PATH = "./config.yml";

// public

async function load() {
    let path = CONFIG_PATH;
    const content = await readFile(path);
    const obj = await loadYaml(content);
    return obj;
}

// private

function readFile(path, encoding){
    encoding = encoding || "utf8";
    return new Promise((resolve, reject) => {
        fs.readFile(path, encoding, (err, data) => {
            if (err) reject(err); else resolve(data);
        });
    });
}

function loadYaml(content) {
    return new Promise((resolve, reject) => {
        try {
            let result = yaml.safeLoad(content);
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
}

// exports

exports.load = load;