// @ts-nocheck
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const EGWebView = require('./e.g.webview');
const TelemetryReporter = require('vscode-extension-telemetry');

const name = 'SOQL Editor';
const extensionId = 'allanoricil.salesforce-soql-editor';
const key = '4ea9b1db-69cd-4355-8a3e-eac076d7325c';

let reporter;
let webview;

/**
 * @param {vscode.ExtensionContext} context
 */
const activate = (context) => {
  var extensionPath = path.join(context.extensionPath, "package.json");
  var packageFile = JSON.parse(fs.readFileSync(extensionPath, 'utf8'));

  let extensionVersion;
  if (packageFile) {
    extensionVersion = packageFile.version;
  }

  reporter = new TelemetryReporter.default(
    extensionId,
    extensionVersion,
    key
  );
  webview = new EGWebView(reporter);
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
