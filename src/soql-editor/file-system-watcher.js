// @ts-nocheck
const vscode = require('vscode');
const axios = require('axios');

class FileSystemWatcher {

    constructor(globPattern, outputChannel){
        this._globPattern = globPattern;
        this._watcher;
        this._context;
        this._outputChannel = outputChannel;
    }

    activate(context){
        this._context = context;
        this._watcher = vscode.workspace.createFileSystemWatcher(this._globPattern, true, false, true);

        this._watcher.onDidChange(() => {
            axios.post(`${process.env.SERVER_ENDPOINT}/vscode/notification/defaultusername`, response.data)
                .catch((_) => this._outputChannel.appendLine('Could not delivery the defaultusername to SOQL editor.'));
        });
    }

    deactivate(){
        this._watcher.dispose();
    }
}


module.exports = FileSystemWatcher;