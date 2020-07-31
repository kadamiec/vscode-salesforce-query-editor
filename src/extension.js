const soqlEditor = require('./soqlEditor');

/**
 * Called when the extension is activated
 * @param {import('vscode').ExtensionContext} context
 */
function activate(context) {
    soqlEditor.activate(context);
}
exports.activate = activate;

/**
 * Called when the extension is deactivated
 */
function deactivate() {
    soqlEditor.deactivate();
}

module.exports = {
    activate,
    deactivate
};