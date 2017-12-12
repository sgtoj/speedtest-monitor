async function sleep(ms) {
    ms = ms || 25;
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

exports.sleep = sleep;