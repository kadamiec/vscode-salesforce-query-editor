// @ts-nocheck
const vscode = require('vscode');

class Storage {

    constructor(folderName){
        this._folderName = folderName;
        this._context;
        this._extensionDirectoryUri;
    }

    set context(context){
        this._context = context;
        this._extensionDirectoryUri = vscode.Uri.joinPath(this._context.globalStorageUri, this._folderName);
    }

    get path(){
        return this._extensionDirectoryUri.fsPath;
    }

    activate(context){
        this.context = context;
        return vscode.workspace.fs.createDirectory(this._extensionDirectoryUri);
    }

    writeFile(fileName, content){
        const filePathUri = vscode.Uri.joinPath(this._extensionDirectoryUri, fileName);
        return vscode.workspace.fs.writeFile(filePathUri, new TextEncoder("utf-8").encode(content));
    }

    readFile(fileName){
        const filePathUri = vscode.Uri.joinPath(this._extensionDirectoryUri, fileName);
        return new Promise(async(resolve, reject) => {
            try{
                const encodedContent = await vscode.workspace.fs.readFile(filePathUri);
                resolve(new TextDecoder("utf-8").decode(encodedContent));
            }catch(error){
                reject(error);
            }
        })
    }

    deleteFile(fileName){
        const filePathUri = vscode.Uri.joinPath(this._extensionDirectoryUri, fileName);
        return new Promise(async(resolve, reject) => {
            try{
                await vscode.workspace.fs.delete(filePathUri);
                resolve();
            }catch(error){
                reject(error);
            }
        })
    }
}

module.exports = Storage;