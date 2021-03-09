const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

function checksum (input) {
    const hash = crypto.createHash('sha256').update(input, 'utf8');
    const hashBase64 = hash.digest('base64');
    return 'sha256-' + hashBase64;
}


 const file = fs.readFileSync(path.resolve('dist', '_nuxt', 'app.js'));
 const hash = checksum(file);
 console.log(hash);