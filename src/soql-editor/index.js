const Outputchannel = require('./output-channel');
const Storage = require('./storage');
const FileSystemWatcher = require('./file-system-watcher');
const Editor = require('./editor');
const Configuration = require('./configuration');
const Keygen = require('../utilities/keygen');
const QueryEditorWebivew = require('./query-editor-webview');
const FetchColorsWebview = require('./fetch-colors-webview');
const NotificationsWebview = require('./notifications-webview');
const SfdxCommands =  require('../utilities/sfdx-commands');

const name = 'Salesforce Query Editor';
const outputChannel = new Outputchannel(name);
const logsStorage = new Storage('logs', outputChannel);
const licenseStorage = new Storage('license', outputChannel);
const queryHistoryStorage = new Storage('query-history', outputChannel);
const loginStorage = new Storage('login', outputChannel);
const editor = new Editor();
const queryEditorWebview = new QueryEditorWebivew('Salesforce Query Editor', 'SFDX.openSalesforceQueryEditor');
const notificationsWebview = new NotificationsWebview('Salesforce Query Editor Notifications', 'SFDX.openSalesforceQueryEditorNotifications');
const fetchColorsWebview = new FetchColorsWebview('Fetch Colors');
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
  
  notificationsWebview.activate(context);
  fetchColorsWebview.activate(context);

  queryEditorWebview.editor = editor;
  queryEditorWebview.keygen = keygen;
  queryEditorWebview.configuration = configuration;
  queryEditorWebview.activate(context);

  outputChannel.appendLine('Salesforce Query Editor is Activated');
};

const deactivate = () => {
  queryEditorWebview.deactivate();
  notificationsWebview.deactivate();
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
  logsStorage,
  licenseStorage,
  queryHistoryStorage,
  loginStorage,
  outputChannel,
  editor,
  configuration
};
