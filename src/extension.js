// @ts-nocheck
const vscode = require('vscode');
const soqlEditor = require('./soql-editor');
const { startServer } = require('./server');

const activate = async (context) => {
    await soqlEditor.activate(context);
    await startServer();
    vscode.window.showInformationMessage('Salesforce Query Editor is Activated');
}

const deactivate = () => {
    soqlEditor.deactivate();
}

module.exports = {
    activate,
    deactivate
};