// @ts-nocheck
const vscode = require('vscode');
const fs = require('fs-extra');
const { execSync } = require('child_process');
const path = require('path');
const  { outputChannel }  = require('../soqlEditor/soqlEditorOutputChannel');

const WORKSPACE_FOLDER = vscode.workspace.workspaceFolders[0].uri.fsPath;
const LOCAL_SFDX_CONFIG_FILE_PATH = path.resolve(WORKSPACE_FOLDER, '.sfdx/sfdx-config.json');
const EXEC_CONFIG = { encoding: 'utf-8', cwd: WORKSPACE_FOLDER };
const DATA_EXPORT_FOLDER = path.resolve(WORKSPACE_FOLDER, 'data');
const SOURCE_TREE_DATA_FOLDER = path.resolve(DATA_EXPORT_FOLDER, 'sourcetree');
const CSV_DATA_FOLDER = path.resolve(DATA_EXPORT_FOLDER, 'csv');
const JSON_DATA_FOLDER = path.resolve(DATA_EXPORT_FOLDER, 'json');

const executeSFDXCommand = function(command){
  return new Promise((resolve, reject) => {
    command += ' --json';
    outputChannel.appendLine(command);
    try{
      const stdout = execSync(command, EXEC_CONFIG);
      resolve(JSON.parse(stdout));
    }catch(error){
      outputChannel.appendLine('Status Code: ' + error);
      reject(error);
    }
  });
};

const getOrgDisplay = function(username){
  return executeSFDXCommand(`sfdx force:org:display -u ${username}`);
};

const openRecordDetailPage = function(recordId){
  return executeSFDXCommand(`sfdx force:org:open -p "/${recordId}"`);
};

const exportSourceTree = function(query, apiVersion){
  return executeSFDXCommand(`sfdx force:data:tree:export -q "${query}" --apiversion ${apiVersion.replace('v', '')} -p -d ${SOURCE_TREE_DATA_FOLDER}`);
};

const getDefaultusername = function() {
  return new Promise(function(resolve, reject){
    console.log(outputChannel);
    outputChannel.appendLine('Fetching local defaultusername');
    fs.readFile(LOCAL_SFDX_CONFIG_FILE_PATH, { encoding: 'utf-8' }, (error, data) => {
      if(error) reject('Set a defaultusername on SFDX and try again');
      else if(data){
        const defaultusername = JSON.parse(data).defaultusername;
        outputChannel.appendLine(`Local defaultusername found: ${defaultusername}`);
        getOrgDisplay(defaultusername)
        .then((success) => {
          if(success.result) resolve(success.result);
        })
        .catch((error) => {
          reject(error);
        });
      }
    });
  });
};

module.exports = {
  getDefaultusername,
  openRecordDetailPage,
  exportSourceTree
};