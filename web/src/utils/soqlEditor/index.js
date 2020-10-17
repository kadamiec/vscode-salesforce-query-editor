import SoqlEditorExtensionApi from './soql-editor-extension-api';
import { SoqlEditorWebviewData } from './soql-editor-webview-data';

const vscode = new SoqlEditorExtensionApi();
const webviewData = new SoqlEditorWebviewData(vscode);
vscode.webviewData = webviewData;
webviewData.$activate();
window.vscode = vscode;
window.webviewData = webviewData;

const soqlEditor = {
    activate: () => {
        webviewData.$activate();
    }
};

export default soqlEditor;
