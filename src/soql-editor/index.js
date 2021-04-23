// @ts-nocheck
const Outputchannel = require('./output-channel');
const Storage = require('./storage');
const FileSystemWatcher = require('./file-system-watcher');
const Editor = require('./editor');
const Configuration = require('./configuration');
const Keygen = require('../utilities/keygen');
const QueryEditorWebview = require('./query-editor-webview');
const FetchColorsWebview = require('./fetch-colors-webview');
const SfdxCommands =  require('../utilities/sfdx-commands');
const Context = require('applicationinsights/out/Library/Context');

const name = 'Salesforce Query Editor';
const outputChannel = new Outputchannel(name);
const logsStorage = new Storage('logs', outputChannel);
const licenseStorage = new Storage('license', outputChannel);
const queryHistoryStorage = new Storage('query-history', outputChannel);
const loginStorage = new Storage('login', outputChannel);
const editor = new Editor();
const fetchColorsWebview = new FetchColorsWebview();
const queryEditorWebview = new QueryEditorWebview(name, editor, 'SFDX.salesforceQueryEditor');
const fsWatcher = new FileSystemWatcher('**/.sfdx/sfdx-config.json', outputChannel);
const configuration = new Configuration(outputChannel);
const keygen = new Keygen(licenseStorage);
const sfdx = new SfdxCommands(outputChannel);

const activate = async (context) => {
  outputChannel.activate(context);
  await Promise.all([
    logsStorage.activate(context),
    licenseStorage.activate(context), 
    queryHistoryStorage.activate(context),
    loginStorage.activate(context)
  ])
  await keygen.validate();

  sfdx.activate(context);
  configuration.activate(context);
  fsWatcher.activate(context);
  editor.activate(keygen);
  fetchColorsWebview.activate();
  queryEditorWebview.activate(context, configuration, keygen, fetchColorsWebview);

  outputChannel.appendLine('Salesforce Query Editor is Activated');
};

const deactivate = () => {
  queryEditorWebview.deactivate();
  fetchColorsWebview.deactivate();
  outputChannel.deactivate();
  fsWatcher.deactivate();
};

module.exports = {
  name,
  activate,
  deactivate,
  keygen,
  sfdx,
  queryEditorWebview,
  fetchColorsWebview,
  logsStorage,
  licenseStorage,
  queryHistoryStorage,
  loginStorage,
  outputChannel,
  editor,
  configuration
};
