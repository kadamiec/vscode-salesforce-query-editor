const path = require("path");
const { exec } = require('child_process');

const root = path.resolve(__dirname, '..')

console.log('Building Vue App');
exec('npm run build', {
    cwd: path.resolve(root, 'web'),
    encode: 'utf-8'
}, function(){
    console.log('Vue App Build completed');
    console.log('Bundling the Extension');
    exec('webpack --config webpack.config.js', {
        cwd: root,
        encode: 'utf-8'
    }, function(){
        console.log('Extension Bundled');
    });
});