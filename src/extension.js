// @ts-nocheck
const vscode = require('vscode');
const soqlEditor = require('./soql-editor');
const { startServer } = require('./server');
const Keygen = require('./utilities/keygen');

const activate = async (context) => {
    soqlEditor.activate(context);

    const keygen = new Keygen(soqlEditor.licenseStorage);
    await keygen.validate();

    startServer(soqlEditor.logsStorage.path, keygen);

    vscode.window.showInformationMessage('SOQL Editor is Activated');
}

const deactivate = () => {
    soqlEditor.deactivate();
}

module.exports = {
    activate,
    deactivate
};