// @ts-nocheck
const vscode = require('vscode');
const SOQLEditorWebView = require('./soqlEditorWebView');

const name = 'SOQL Editor';

let webview;

/**
 * @param {vscode.ExtensionContext} context
 */
const activate = (context) => {
  webview = new SOQLEditorWebView();
  webview.activate(context, name, 'SFDX.soqlEditor');
  vscode.window.showInformationMessage('The SOQL Editor was Activated');
};

const deactivate = () => {
  webview.deactivate();
};

module.exports = {
  name,
  activate,
  deactivate,
};
