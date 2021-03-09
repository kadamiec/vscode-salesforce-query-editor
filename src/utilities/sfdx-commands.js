// @ts-nocheck
const vscode = require('vscode');
const fs = require('fs-extra');
const { exec } = require('child_process');
const path = require('path');

class SfdxCommands {

  constructor(outputChannel){
    this._cwd;
    this._context;
    this._outputChannel = outputChannel;
  }

  activate(context){
    this._context = context;
    this._cwd = vscode.workspace.workspaceFolders[0].uri.fsPath;
    this._outputChannel.appendLine('CWD: ' + this._cwd);
  }

  get localConfigFilePath(){
    return path.resolve(this._cwd, '.sfdx/sfdx-config.json');
  }

  get dataExportFolder(){
    return path.resolve(this._cwd, 'data');
  }

  get sourceTreeDataFolder(){
    return path.resolve(this.dataExportFolder, 'sourcetree');
  }

  execute(command){
    return new Promise((resolve, reject) => {
      command += ' --json';
      this._outputChannel.appendLine(command);
      exec(command, { encoding: 'utf-8', cwd: this._cwd }, (error, stdout, stderr) => {
        if (error) {
          this._outputChannel.appendLine(`error: ${error.message}`);
          reject(error);
        }
      
        if (stderr) {
          this._outputChannel.appendLine(`stderr: ${stderr}`);
        }
      
        this._outputChannel.appendLine(`stdout:\n${stdout}`);
  
        resolve(JSON.parse(stdout));
      });
    });
  };
  
  getOrgDisplay(username){
    return this.execute(`sfdx force:org:display -u "${username}"`);
  };
  
  
  openPage(username, page){
    return this.execute(`sfdx force:org:open -p "${page}" -u "${username}"`);
  }
  
  exportSourceTree(username, query, apiVersion){
    return this.execute(`sfdx force:data:tree:export -q "${query}" -u "${username}" --apiversion ${apiVersion.replace('v', '')} -p -d "${this.sourceTreeDataFolder}"`);
  };
  
  getConfig(config){
    return this.execute(`sfdx force:config:get ` + config);
  };
  
  getDefaultusername(){
    return new Promise((resolve, reject) => {
      this._outputChannel.appendLine('Fetching local defaultusername');
      fs.readFile(this.localConfigFilePath, { encoding: 'utf-8' }, (error, data) => {
        if(error) reject('Set a defaultusername on SFDX and try again');
        else if(data){
          const defaultusername = JSON.parse(data).defaultusername;
          this._outputChannel.appendLine(`Local defaultusername found: ${defaultusername}`);
          this.getOrgDisplay(defaultusername)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
        }
      });
    });
  };
  
  getEnvironments(){
    return this.execute('sfdx force:org:list --all');
  };
}



module.exports = SfdxCommands;