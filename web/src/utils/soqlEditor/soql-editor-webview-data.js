import {
    WebviewData
} from '../vscode.web';

class SoqlEditorWebviewData extends WebviewData {
    constructor(vscode) {
        super(vscode);
        this.startPath = '';
        this.rootPath = '';
    }
}

export {
    SoqlEditorWebviewData
};
