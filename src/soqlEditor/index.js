// @ts-nocheck
const vscode = require('vscode');
const Webview = require('./webview');
const Outputchannel = require('./output-channel');
const Storage = require('./storage');
const FileSystemWatcher = require('./file-system-watcher');
const Editor = require('./editor');
const Configuration = require('./configuration');

const name = 'SOQL Editor';
const logsStorage = new Storage('logs');
const licenseStorage = new Storage('license');
const queryHistoryStorage = new Storage('query-history');
const editor = new Editor();
const webview = new Webview(name, editor, 'SFDX.soqlEditor');
const fsWatcher = new FileSystemWatcher('**/.sfdx/sfdx-config.json');
const outputChannel = new Outputchannel(name);
const configuration = new Configuration();


const activate = async (context) => {
  await Promise.all([
    logsStorage.activate(context),
    licenseStorage.activate(context), 
    queryHistoryStorage.activate(context)
  ])
  webview.activate(context);
  outputChannel.activate(context);
  fsWatcher.activate(context);
  vscode.window.showInformationMessage('SOQL Editor is Activated');
  outputChannel.appendLine('SOQL Editor is Activated');
};

const deactivate = () => {
  webview.deactivate();
  outputChannel.deactivate();
  fsWatcher.deactivate();
};

module.exports = {
  name,
  activate,
  deactivate,
  webview,
  logsStorage,
  licenseStorage,
  queryHistoryStorage,
  outputChannel,
  editor,
  configuration
};
