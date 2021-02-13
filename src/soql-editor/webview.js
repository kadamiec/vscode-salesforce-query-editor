// @ts-nocheck
const { WebView } = require('../vscode/vscode.webview');

class Webview extends WebView {

  constructor(name, editor, contributeCommand) {
    super();
    this._name = name;
    this._contributeCommand = contributeCommand;
    this._editor = editor;
    this._activeEditorName;
    this._windowModel;
    
    this.didChangeViewState = () => {
      this._editor.setEditor();
    };

    this.onDidPose =  () => {
      this._editor.sendEditingSOQL();
    }
  }

  set activeEditorName(editorName){
    this._activeEditorName = editorName;
  }

  activate(context) {
    return super.activate(context, this._name, this._contributeCommand);
  }

  deactivate(){
    this.fileSystemWatcher.dispose();
  }

}

module.exports = Webview;
