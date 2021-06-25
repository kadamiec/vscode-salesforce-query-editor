const Outputchannel = require('./output-channel');
const Storage = require('./storage');
const FileSystemWatcher = require('./file-system-watcher');
const Editor = require('./editor');
const Configuration = require('./configuration');
const QueryEditorWebivew = require('./query-editor-webview');
const FetchColorsWebview = require('./fetch-colors-webview');
const NotificationsWebview = require('./notifications-webview');
const SfdxCommands = require('../utilities/sfdx-commands');

const name = 'Salesforce Query Editor';
const outputChannel = new Outputchannel(name);
const logsStorage = new Storage('logs', outputChannel);
const editor = new Editor();
const queryEditorWebview = new QueryEditorWebivew('Salesforce Query Editor', 'SFDX.openSalesforceQueryEditor');
const notificationsWebview = new NotificationsWebview('Salesforce Query Editor Notifications', 'SFDX.openSalesforceQueryEditorNotifications');
const fetchColorsWebview = new FetchColorsWebview('Fetch Colors');
const fsWatcher = new FileSystemWatcher('**/.sfdx/sfdx-config.json', outputChannel);
const configuration = new Configuration(outputChannel);
const sfdx = new SfdxCommands(outputChannel);

const activate = async (context) => {
  outputChannel.activate(context);
  await Promise.all([
    logsStorage.activate(context)
  ])

  sfdx.activate(context);
  configuration.activate(context);
  fsWatcher.activate(context);
  editor.activate();

  //webview to display release notes
  if (!context.globalState.get(`DISPLAY_NOTIFICATIONS_WEBVIEW_ONCE_PER_RELEASE_ON_ACTIVATION_${context.extension.packageJSON.version}`)) {
    notificationsWebview.showPanelOnActivate = true;
    context.globalState.update(`DISPLAY_NOTIFICATIONS_WEBVIEW_ONCE_PER_RELEASE_ON_ACTIVATION_${context.extension.packageJSON.version}`, true);
  }
  notificationsWebview.activate(context);

  //webview to retrieve vs code colors
  fetchColorsWebview.activate(context);

  //webview to execute queries
  queryEditorWebview.editor = editor;
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
  sfdx,
  logsStorage,
  outputChannel,
  editor,
  configuration,
  fetchColorsWebview
};
