// @ts-nocheck
const vscode = require('vscode');
const fs = require('fs-extra');
const { execSync } = require('child_process');
const path = require('path');

const WORKSPACE_FOLDER = vscode.workspace.workspaceFolders[0].uri.fsPath;
const LOCAL_SFDX_CONFIG_FILE_PATH = path.resolve(WORKSPACE_FOLDER, '.sfdx/sfdx-config.json');
const EXEC_CONFIG = { encoding: 'utf-8', cwd: WORKSPACE_FOLDER };
const DATA_EXPORT_FOLDER = path.resolve(WORKSPACE_FOLDER, 'data');
const SOURCE_TREE_DATA_FOLDER = path.resolve(DATA_EXPORT_FOLDER, 'sourcetree');
const CSV_DATA_FOLDER = path.resolve(DATA_EXPORT_FOLDER, 'csv');
const JSON_DATA_FOLDER = path.resolve(DATA_EXPORT_FOLDER, 'json');

const executeSFDXCommand = (command) => {
  return new Promise((resolve, reject) => {
    command += ' --json';
    try{
      const stdout = execSync(command, EXEC_CONFIG);
      resolve(JSON.parse(stdout));
    }catch(error){
      console.error(error);
      reject(error);
    }
  });
};

const getOrgDisplay = (username) => {
  return executeSFDXCommand(`sfdx force:org:display -u ${username}`);
};

const openRecordDetailPage = (recordId) => {
  return executeSFDXCommand(`sfdx force:org:open -p "/${recordId}"`);
};

const exportSourceTree = (query, apiVersion) => {
  return executeSFDXCommand(`sfdx force:data:tree:export -q "${query}" --apiversion ${apiVersion.replace('v', '')} -p -d ${SOURCE_TREE_DATA_FOLDER}`);
};

const getDefaultusername = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(LOCAL_SFDX_CONFIG_FILE_PATH, { encoding: 'utf-8' }, (error, data) => {
      if(error) reject('Set a defaultusername on SFDX and try again');
      else if(data){
        const defaultusername = JSON.parse(data).defaultusername;
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