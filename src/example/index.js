// @ts-nocheck
const vscode = require('vscode');
const EGWebView = require('./e.g.webview');
const TelemetryReporter = require('vscode-extension-telemetry');

const name = 'SOQL Editor';

// all events will be prefixed with this event name
const extensionId = 'allanoricil.salesforce-soql-editor';

// extension version will be reported as a property with each event
const extensionVersion = '0.2.8';

// the application insights key (also known as instrumentation key)
const key = '4ea9b1db-69cd-4355-8a3e-eac076d7325c';

const reporter = new TelemetryReporter.default(
  extensionId,
  extensionVersion,
  key
);

const webview = new EGWebView(reporter);

/**
 * @param {vscode.ExtensionContext} context
 */
const activate = (context) => {
  webview.activate(context, name, 'SFDX.soqlEditor');
  vscode.window.showInformationMessage('Salesforce SOQL Editor is Activated');
  reporter.sendTelemetryEvent('activation');
  context.subscriptions.push(reporter);
};

const deactivate = () => {
  webview.deactivate();
  reporter.dispose();
};

module.exports = {
  name,
  activate,
  deactivate,
};
