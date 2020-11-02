// @ts-nocheck
const vscode = require('vscode');
const fs = require('fs-extra');
const { exec } = require('child_process');

const SFDX_WORKSPACE_CONFIG_FILE_PATH = `${vscode.workspace.rootPath}/.sfdx/sfdx-config.json`;

const executeSfdxCommand = (command, callback) => {
  command += ' --json';
  exec(command, { encoding: 'utf-8', cwd: vscode.workspace.rootPath }, (error, stdout, stderr) => {
    if(error) callback('error'); 
    else callback(JSON.parse(stdout));
  });
};

const getOrgDisplay = (username, callback) => {
  return executeSfdxCommand(`sfdx force:org:display -u ${username}`, callback);
};

const openRecordDetailPage = (recordId, callback) => {
  return executeSfdxCommand(`sfdx force:org:open -p "/${recordId}"`, callback);
};

const bulkUpsert = (csvPath, sObjectName, externalId, callback) => {
  return executeSfdxCommand(`sfdx force:data:bulk:upsert -s ${sObjectName} -f ${csvPath} -i ${externalId } -w 120`, callback);
};

const getDefaultusername = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(SFDX_WORKSPACE_CONFIG_FILE_PATH, { encoding: 'utf-8' }, (error, data) => {
      if(error) reject('Set a defaultusername on SFDX and try again');
      else if(data){
        const defaultusername = JSON.parse(data).defaultusername;
        getOrgDisplay(defaultusername, (orgDisplayResponse) => {
          if(orgDisplayResponse.result){
            resolve(orgDisplayResponse.result);
          }else {
            reject('Could not get accessToken for the current defaultusername');
          }
        });
      }
    });
  });
};

module.exports = {
  getDefaultusername,
  openRecordDetailPage,
  bulkUpsert
};