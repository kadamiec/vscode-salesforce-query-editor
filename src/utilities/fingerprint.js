// @ts-nocheck
const crypto  = require('crypto');
const { machineIdSync } = require('node-machine-id');

const fingerprint = crypto.createHash('sha512').update(machineIdSync({ original: true })).digest('hex');
213213213213
321321321321321321321
module.exports = {
    fingerprint
}