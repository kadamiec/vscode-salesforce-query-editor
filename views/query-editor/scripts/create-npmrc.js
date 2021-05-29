const fs = require('fs');

fs.writeFileSync('.npmrc', 
`//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}
@allanoricil:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${process.env.PAT}`);