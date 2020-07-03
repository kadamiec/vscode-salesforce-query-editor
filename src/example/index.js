// @ts-nocheck
const vscode = require('vscode');
const fs = require('fs-extra');
const path = require('path');
const EGWebView = require('./e.g.webview');
const {
  setupSchemaGlobalDirectory
} = require('../lib/utils.js');

const name = 'SOQL Editor';
const webview = new EGWebView();
/**
 * @param {vscode.ExtensionContext} context
 */
const activate = (context) => {
  webview.activate(context, name, 'SFDX.soqlEditor');
  vscode.window.showInformationMessage(
    'Salesforce SOQL Editor is Activated'
  );
};

const deactivate = () => {
  webview.deactivate();
};

module.exports = {
  name,
  activate,
  deactivate,
};