const vscode = require('vscode');
const path = require('path');

class Webview {

  constructor(name, contributeCommand, html, column, enableScripts, retainContextWhenHidden, enableFindWidget, resourcesPath, iconName, showPanelOnActivate) {
    this._name = name;
    this._contributeCommand = contributeCommand;
    this._column = column;
    this._enableScripts = enableScripts;
    this._retainContextWhenHidden = retainContextWhenHidden;
    this._enableFindWidget = enableFindWidget;
    this._resourcesPath = resourcesPath;
    this._iconName = iconName;
    this._html = html;
    this._showPanelOnActivate = showPanelOnActivate;
  }

  activate(context) {
    this._context = context;
    if (this._contributeCommand) {
      vscode.commands.registerCommand(this._contributeCommand, () => this.onCommand())
    }

    if (this._showPanelOnActivate) this._createPanel();
  }

  onCommand() {
    this.showPanel();
  }

  deactivate() {
    this._panel.dispose();
  }

  didPose() { }

  didDispose() {
    this._panel = null;
  }

  didChangeViewState(state) { }

  onDidReceiveMessage(message) { }

  showPanel() {
    if (!this._panel) this._createPanel();
    this._panel.reveal(this._column);
    this.didPose();
  }

  set showPanelOnActivate(showPanelOnActivate) {
    this._showPanelOnActivate = showPanelOnActivate;
  }

  _createPanel() {
    const appDir = path.join(this._context.extensionPath, this._resourcesPath);
    const resourcesDir = path.dirname(appDir);

    this._panel = vscode.window.createWebviewPanel(
      this._name,
      this._name,
      this._column,
      {
        enableScripts: this._enableScripts,
        retainContextWhenHidden: this._retainContextWhenHidden,
        enableFindWidget: this._enableFindWidget,
        localResourceRoots: [vscode.Uri.file(resourcesDir)],
      }
    );

    this._panel.webview.html = this._setLinksAndSrcs(this._html, appDir);

    if (this._iconName) {
      this._panel.iconPath = {
        light: vscode.Uri.file(path.join(this._context.extensionPath, 'images', `${this._iconName}_light.svg`)),
        dark: vscode.Uri.file(path.join(this._context.extensionPath, 'images', `${this._iconName}_dark.svg`))
      };
    }

    this._panel.onDidDispose(
      () => {
        this.didDispose()
      },
      undefined,
      this._context.subscriptions
    );

    this._panel.onDidChangeViewState(
      (state) => this.didChangeViewState(state),
      undefined,
      this._context.subscriptions
    );

    this._panel.webview.onDidReceiveMessage((message) => this.didReceiveMessage(message));
  }

  _setLinksAndSrcs(html, appDir) {
    html = html.replace(/(href=|src=)(.+?)(\ |>)/g, (m, $1, $2, $3) => {
      let uri = $2;
      uri = uri.replace('"', '').replace("'", '');
      uri.indexOf('/_nuxt') === 0 && (uri = `.${uri}`);
      if (uri.substring(0, 1) == '.') {
        const resourceUriOnDisk = vscode.Uri.file(path.resolve(path.dirname(appDir), uri));
        const resourceUri = this._panel.webview.asWebviewUri(resourceUriOnDisk);
        uri = `${$1}${resourceUri}${$3}`;
        return uri.replace('%22', '');
      }
      return m;
    });
    return html;
  }

}

module.exports = Webview;
