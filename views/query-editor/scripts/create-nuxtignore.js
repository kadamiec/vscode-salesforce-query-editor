const fs = require('fs');

async function run(){
    const pagesToIgnore = [
        'pages/product-description.vue',
        'pages/update-password.vue',
        'pages/privacy-policy.vue'
    ]
    
    fs.writeFileSync('.nuxtignore', pagesToIgnore.join('\n'), { encoding: 'utf-8'});
}

run();
