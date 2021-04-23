// @ts-nocheck
const vscode = require('vscode');
const fs = require('fs');

class Storage {

    constructor(folderName, outputChannel){
        this._folderName = folderName;
        this._context;
        this._extensionDirectoryUri;
        this._outputChannel = outputChannel;
    }

    get path(){
        return this._extensionDirectoryUri.fsPath;
    }

    activate(context){
        this._context = context;
        this._extensionDirectoryUri = vscode.Uri.joinPath(this._context.globalStorageUri, this._folderName);
        this._outputChannel.appendLine('GSP: ' + this.path);
        return vscode.workspace.fs.createDirectory(this._extensionDirectoryUri);
    }

    writeFile(fileName, content){
        return vscode.workspace.fs.writeFile(this.filePathUri(fileName), new TextEncoder("utf-8").encode(content));
    }

    readFile(fileName){
        return new Promise(async(resolve, reject) => {
            try{
                const encodedContent = await vscode.workspace.fs.readFile(this.filePathUri(fileName));
                resolve(new TextDecoder("utf-8").decode(encodedContent));
            }catch(error){
                reject(error);
            }
        })
    }

    fileExists(fileName){
        return fs.existsSync(this.filePathUri(fileName));
    }

    deleteFile(fileName){
        return new Promise(async(resolve, reject) => {
            try{
                await vscode.workspace.fs.delete(this.filePathUri(fileName));
                resolve();
            }catch(error){
                reject(error);
            }
        })
    }

    filePathUri(fileName){
        return vscode.Uri.joinPath(this._extensionDirectoryUri, fileName);
    }
}

module.exports = Storage;