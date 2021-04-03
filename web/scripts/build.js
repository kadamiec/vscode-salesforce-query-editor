const fs = require('fs');
const util = require('util');
const path = require('path');
const exec = util.promisify(require('child_process').exec);

const NUXTIGNORE_PATH = path.resolve('.nuxtignore');

async function run(){
    if(process.env.IS_VSCODE){
        const nuxtignore = `pages/product-description.vue\npages/update-password.vue`

        fs.writeFileSync(NUXTIGNORE_PATH, nuxtignore, { encoding: 'utf-8'});
    }

    if(process.env.IS_BUILD)
    await exec('nuxt build');
    else
    await exec('nuxt generate');
    
    if(process.env.IS_VSCODE &&  fs.existsSync(NUXTIGNORE_PATH)){
        fs.unlinkSync(NUXTIGNORE_PATH);
    }
}

run();
