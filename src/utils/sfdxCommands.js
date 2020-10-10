// @ts-nocheck
const vscode = require('vscode');
const fs = require('fs-extra');
const { exec } = require('child_process');
const axios = require('axios');

const executeSfdxCommand = (command, callback) => {
  command += ' --json';
  exec(command, { encoding: 'utf-8', cwd: vscode.workspace.rootPath }, (error, stdout, stderr)=>{
    if(!error && !stderr) callback(JSON.parse(stdout));
    else callback('error');
  });
};

const getOrgDisplay = (username, callback) => {
  return executeSfdxCommand(`sfdx force:org:display -u ${username}`, callback);
};

const getDefaultusername = () =>{
  return new Promise((resolve, reject) => {
    fs.readFile(`${vscode.workspace.rootPath}/.sfdx/sfdx-config.json`, {encoding: 'utf-8'}, (error, data) => {
      if(error) reject('Set a defaultusername on SFDX and try again');
      else if(data){
        const defaultusername = JSON.parse(data).defaultusername;
        getOrgDisplay(defaultusername, (org) => {
          if(org.result){
            resolve(org.result);
          }else {
            reject('Could not get accessToken for the current defaultusername');
          }
        });
      }
    });
  });
};


const getGlobalDescribe = (defaultOrg) => {
  return axios.get(`${defaultOrg.instanceUrl}/services/data/v48.0/sobjects`, {
    headers: {
      Authorization: `Bearer ${defaultOrg.accessToken}`,
    },
  });
};

const executeSOQL = (soql, defaultOrg) => {
  return axios.get(
    encodeURI(`${defaultOrg.instanceUrl}/services/data/v48.0/query/?q=${soql.replace(/\s\s+/g, ' ').replace(
      /\s/g,
      '+'
    )}`), {
      headers: {
        Authorization: `Bearer ${defaultOrg.accessToken}`,
      },
    }
  );
};

const callSObjectDescribe = (defaultOrg, sObjectName) => {
  return axios.get(
    `${defaultOrg.instanceUrl}/services/data/v48.0/sobjects/${sObjectName}/describe/`, {
      headers: {
        Authorization: `Bearer ${defaultOrg.accessToken}`,
      },
    }
  );
};

const openRecordDetailPage = (recordId) =>{
  exec(
    `sfdx force:org:open -p "/${recordId}"`, {
      encoding: 'utf-8',
      cwd: vscode.workspace.rootPath,
    }
  );
};


module.exports = {
  getDefaultusername,
  getGlobalDescribe,
  callSObjectDescribe,
  executeSOQL,
  openRecordDetailPage
};