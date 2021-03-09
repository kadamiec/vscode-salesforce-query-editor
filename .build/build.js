const path = require("path");
const { exec } = require('child_process');

const root = path.resolve(__dirname, '..')

exec('npm run build', {
    cwd: path.resolve(root, 'web'),
    encode: 'utf-8'
}, () => {
    exec('npm run generate', { 
        cwd: path.resolve(root, 'web'),
        encode: 'utf-8'
    })
});

exec('npm run build', {
    cwd: root,
    encode: 'utf-8'
});