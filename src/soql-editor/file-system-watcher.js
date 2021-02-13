// @ts-nocheck
const vscode = require('vscode');
const axios = require('axios');
const { outputChannel: oc } = require('./index.js');

class FileSystemWatcher {

    constructor(globPattern){
        this._globPattern = globPattern;
        this._watcher;
        this._context;
    }

    activate(context){
        this._context = context;
        this._watcher = vscode.workspace.createFileSystemWatcher(this._globPattern, true, false, true);

        this._watcher.onDidChange(async () => {
            try{
                const response = await axios.get(`${process.env.SERVER_ENDPOINT}/sfdx/defaultusername`)
                await axios.post(`${process.env.SERVER_ENDPOINT}/notification/defaultusername`, { username: response.data });
            }catch(error){
                console.error(error);
                oc.appendLine('Could not delivery the new defaultusername to SOQL editor.');
            }
        });
    }

    deactivate(){
        this._watcher.dispose();
    }
}


module.exports = FileSystemWatcher;