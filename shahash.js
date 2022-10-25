const crypto = require('crypto');
// const hexToBinary = require('hex-to-binary');
const shaHash = (...inputs) => {
    const hash = crypto.createHash('sha256');
    hash.update(inputs.sort().join(" "));

    return (hash.digest('hex'));
}
module.exports = shaHash;