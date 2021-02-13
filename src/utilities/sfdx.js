// @ts-nocheck
const fs = require('fs-extra');
const { exec } = require('child_process');
const path = require('path');

let WORKSPACE_FOLDER;
let LOCAL_SFDX_CONFIG_FILE_PATH;
let EXEC_CONFIG;
if(process.env.NODE_ENV === "production"){
  const vscode = require('vscode');
  const  { outputChannel }  = require('../soql-editor/output-channel'); 
  WORKSPACE_FOLDER = vscode.workspace.workspaceFolders[0].uri.fsPath;
  LOCAL_SFDX_CONFIG_FILE_PATH = path.resolve(WORKSPACE_FOLDER, '.sfdx/sfdx-config.json');
  EXEC_CONFIG = { encoding: 'utf-8', cwd: WORKSPACE_FOLDER };
}else{
  WORKSPACE_FOLDER = path.resolve('C:/Users/allan_000/workspace/schema-builder/sfdx-project');
  LOCAL_SFDX_CONFIG_FILE_PATH = path.resolve(WORKSPACE_FOLDER, '.sfdx/sfdx-config.json');
  EXEC_CONFIG = { encoding: 'utf-8', cwd: WORKSPACE_FOLDER };
}

console.log(WORKSPACE_FOLDER);
console.log(LOCAL_SFDX_CONFIG_FILE_PATH);
console.log(EXEC_CONFIG);


const DATA_EXPORT_FOLDER = path.resolve(WORKSPACE_FOLDER, 'data');
const SOURCE_TREE_DATA_FOLDER = path.resolve(DATA_EXPORT_FOLDER, 'sourcetree');
const CSV_DATA_FOLDER = path.resolve(DATA_EXPORT_FOLDER, 'csv');
const JSON_DATA_FOLDER = path.resolve(DATA_EXPORT_FOLDER, 'json');

const executeSFDXCommand = function(command){
  return new Promise((resolve, reject) => {
    command += ' --json';
    console.log(command);
    exec(command, EXEC_CONFIG, (error, stdout, stderr) => {
      if (error) {
        console.error(`error: ${error.message}`);
        reject(error);
      }
    
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
    
      console.log(`stdout:\n${stdout}`);

      resolve(JSON.parse(stdout));
    });
  });
};

const getOrgDisplay = function(username){
  return executeSFDXCommand(`sfdx force:org:display -u "${username}"`);
};

const openRecordDetailPage = function(recordId){
  return executeSFDXCommand(`sfdx force:org:open -p "/${recordId}"`);
};

const exportSourceTree = function(query, apiVersion){
  return executeSFDXCommand(`sfdx force:data:tree:export -q "${query}" --apiversion ${apiVersion.replace('v', '')} -p -d ${SOURCE_TREE_DATA_FOLDER}`);
};

const getConfig = function(config){
  return executeSFDXCommand(`sfdx force:config:get ` + config);
};

const getDefaultusername = function() {
  return new Promise(function(resolve, reject){
    console.log('Fetching local defaultusername');
    fs.readFile(LOCAL_SFDX_CONFIG_FILE_PATH, { encoding: 'utf-8' }, (error, data) => {
      if(error) reject('Set a defaultusername on SFDX and try again');
      else if(data){
        const defaultusername = JSON.parse(data).defaultusername;
        console.log(`Local defaultusername found: ${defaultusername}`);
        getOrgDisplay(defaultusername)
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

const getEnvironments = function() {
  return executeSFDXCommand('sfdx force:org:list --all');
};

module.exports = {
  getEnvironments,
  getDefaultusername,
  getOrgDisplay,
  openRecordDetailPage,
  exportSourceTree,
  getConfig
};