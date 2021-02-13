/* eslint-disable no-unused-vars */
const vscode = require('vscode');
const path = require('path');
const fs = require('fs-extra');
const BridgeData = require('./vscode.bridge');
const {
  Message,
  ReceivedMessage,
  Handler
} = require('./vscode.message');
const WebviewApi = require('./vscode.webviewApi');

/**
 * WebView
 * @class WebView
 */
class WebView {
  /**
   * Creates an instance of WebView.
   * @param {Handler} [handler=new Handler()]
   * @memberof WebView
   */
  constructor(handler = new Handler()) {
    this._handler = handler;
    this._handler.addApi(WebviewApi);
    this._panel = undefined;
    this._bridgeData = new BridgeData();
    this._bridgeData.syncHandler = (data) => {
      this.panel.webview.postMessage(Message.syncBridgeData(data));
    };

    /**
     * @type {() => Promise}
     */
    this.onBeforePose = undefined;

    /**
     * @type {(uri: vscode.Uri) => void}
     */
    this.onDidPose = undefined;
    /**
     * @type {() => void}
     */
    this.onDidDispose = undefined;
    /**
     * @type {(state: any) => void}
     */
    this.onDidChangeViewState = undefined;
    /**
     * @type {(message: ReceivedMessage) => void}
     */
    this.onDidReceiveMessage = undefined;

    this.sfdxConfig = undefined;
  }
  get name() {
    return WebviewApi.name;
  }
  get handler() {
    return this._handler;
  }
  get panel() {
    return this._panel;
  }
  get bridgeData() {
    return this._bridgeData;
  }
  get uri() {
    return this._uri;
  }

  /**
   * Show panel
   * @param {vscode.ExtensionContext} context
   * @param {string} htmlPath
   * @param {string} [viewType=this.name]
   * @param {string} [title=this.name]
   * @param {number} [viewColumn=vscode.ViewColumn.Three]
   * @param {boolean} [enableScripts=true]
   * @param {boolean} [retainContextWhenHidden=true]
   * @memberof WebView
   */
  showPanel(
    context,
    htmlPath,
    viewType = this.name,
    title = this.name,
    viewColumn = vscode.ViewColumn.Three,
    enableScripts = true,
    retainContextWhenHidden = true
  ) {
    if (this.panel) {
      this.panel.reveal(viewColumn);
    } else {
      this._panel = vscode.window.createWebviewPanel(
        viewType,
        title,
        viewColumn, // show in position of editor
        {
          enableScripts, // default disabled
          retainContextWhenHidden, // keep state and avoid being reset When hidden webview
          localResourceRoots: [vscode.Uri.file(path.dirname(htmlPath))],
        }
      );

      const darkIcon = vscode.Uri.file(
        path.join(context.extensionPath, '.images', 'icon_dark.png')
      );

      const lightIcon = vscode.Uri.file(
        path.join(context.extensionPath, '.images', 'icon_light.png')
      );

      this.panel.iconPath = {
        light: lightIcon,
        dark: darkIcon,
      };
      // load html
      this.panel.webview.html = this.prepareView(`<!doctype html><html lang="en" data-n-head="%7B%22lang%22:%7B%221%22:%22en%22%7D%7D"> <head> <title>salesforce-query-editor</title> <meta data-n-head="1" charset="utf-8"> <meta data-n-head="1" name="viewport" content="width=device-width,initial-scale=1"> <meta data-n-head="1" data-hid="description" name="description" content=""> <meta data-n-head="1" data-hid="charset" charset="utf-8"> <meta data-n-head="1" data-hid="mobile-web-app-capable" name="mobile-web-app-capable" content="yes"> <meta data-n-head="1" data-hid="apple-mobile-web-app-title" name="apple-mobile-web-app-title" content="Salesforce Query Editor"> <meta data-n-head="1" data-hid="theme-color" name="theme-color" content="#ffffff"> <meta data-n-head="1" data-hid="og:type" name="og:type" property="og:type" content="website"> <meta data-n-head="1" data-hid="og:title" name="og:title" property="og:title" content="Salesforce Query Editor"> <meta data-n-head="1" data-hid="og:site_name" name="og:site_name" property="og:site_name" content="Salesforce Query Editor"> <meta data-n-head="1" data-hid="og:description" name="og:description" property="og:description" content="This Web App helps Salesforce Developers to write Queries."> <link data-n-head="1" data-hid="shortcut-icon" rel="shortcut icon" href="/_nuxt/icons/icon_64x64.72c43d.png"> <link data-n-head="1" data-hid="apple-touch-icon" rel="apple-touch-icon" href="/_nuxt/icons/icon_512x512.72c43d.png" sizes="512x512"> <link data-n-head="1" rel="manifest" href="/_nuxt/manifest.dce3af21.json" data-hid="manifest"> <script data-n-head="1" src="https://js.stripe.com/v3/" crossorigin="anonymous"></script> <script data-n-head="1" data-hid="adsbygoogle-script" async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script> <script data-n-head="1" data-hid="adsbygoogle">window.__abg_called||((window.adsbygoogle=window.adsbygoogle||[]).push({google_ad_client:"ca-pub-2402391224743305",enable_page_level_ads:!1,overlays:{bottom:!1}}),window.__abg_called=!0)</script> <script src="https://cdn.jsdelivr.net/npm/${process.env.PACKAGE_NAME}/dist/_nuxt/app.js"></script></head> <body> <div id="__nuxt"><style>#nuxt-loading{background:#fff;visibility:hidden;opacity:0;position:absolute;left:0;right:0;top:0;bottom:0;display:flex;justify-content:center;align-items:center;flex-direction:column;animation:nuxtLoadingIn 10s ease;-webkit-animation:nuxtLoadingIn 10s ease;animation-fill-mode:forwards;overflow:hidden}@keyframes nuxtLoadingIn{0%{visibility:hidden;opacity:0}20%{visibility:visible;opacity:0}100%{visibility:visible;opacity:1}}@-webkit-keyframes nuxtLoadingIn{0%{visibility:hidden;opacity:0}20%{visibility:visible;opacity:0}100%{visibility:visible;opacity:1}}#nuxt-loading>div,#nuxt-loading>div:after{border-radius:50%;width:5rem;height:5rem}#nuxt-loading>div{font-size:10px;position:relative;text-indent:-9999em;border:.5rem solid #f5f5f5;border-left:.5rem solid #000;-webkit-transform:translateZ(0);-ms-transform:translateZ(0);transform:translateZ(0);-webkit-animation:nuxtLoading 1.1s infinite linear;animation:nuxtLoading 1.1s infinite linear}#nuxt-loading.error>div{border-left:.5rem solid #ff4500;animation-duration:5s}@-webkit-keyframes nuxtLoading{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes nuxtLoading{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}</style><script>window.addEventListener("error",function(){var e=document.getElementById("nuxt-loading");e&&(e.className+=" error")})</script><div id="nuxt-loading" aria-live="polite" role="status"><div>Loading...</div></div></div><script>window.__NUXT__={config:{}}</script> </body></html>`, htmlPath);
      this.panel.onDidDispose(
        () => this.didDispose(),
        undefined,
        context.subscriptions
      );
      // on webview visibility changed or position changed
      this.panel.onDidChangeViewState(
        (state) => this.didChangeViewState(state),
        undefined,
        context.subscriptions
      );
      this.panel.webview.onDidReceiveMessage(
        (message) => this.didReceiveMessage(message),
        undefined,
        context.subscriptions
      );
    }
  }

  /**
   * On did receive message
   * @param {ReceivedMessage} message
   * @memberof WebView
   */
  didReceiveMessage(message) {
    this.handler &&
      this.handler.received &&
      this.handler.received(this.panel.webview, message);
    this.onDidReceiveMessage && this.onDidReceiveMessage(message);
  }

  /**
   * On did change view state
   * @param {*} state
   * @memberof WebView
   */
  didChangeViewState(state) {
    // const p = state.panel;
    this.onDidChangeViewState && this.onDidChangeViewState(state);
    // this.panel.webview.postMessage(Message.webviewDidChangeViewState(undefined));
    console.log(`Webview(${this.name}) did changeView state.`);
  }

  /**
   * On did dispose
   * @memberof WebView
   */
  didDispose() {
    this._panel = undefined;
    this.onDidDispose && this.onDidDispose();
    console.log(`Webview(${this.name}) did dispose.`);
  }

  /**
   * Activate
   * @param {import('vscode').ExtensionContext} context vscode extension context
   * @param {string} name webview name
   * @param {string} cmdName cmd name
   * @returns {this}
   * @memberof WebView
   */
  activate(context, name, cmdName) {
    WebviewApi.activate(context, name, this.bridgeData);
    const htmlPath = path.join( context.extensionPath, 'web', 'dist', 'index.html');
    context.subscriptions.push(
      vscode.commands.registerCommand(cmdName, (uri) => {
          this._uri = uri;
          this.showPanel(context, htmlPath);
          this.bridgeData.updateItems({
              extensionPath: context.extensionPath,
              rootPath: vscode.workspace.workspaceFolders[0],
              startPath: uri ? uri.path : vscode.workspace.workspaceFolders[0]
            },
            false
          );
          this.bridgeData.syncAll();
          this.onDidPose && this.onDidPose(uri);
          this.panel.webview.postMessage(Message.webviewDidPose(undefined));
      })
    );
    return this;
  }

  postMessage(message, data) {
    this.panel.webview.postMessage({
      cmd: message,
      data: data,
    });
  }

  showInformationMessage(message){
    vscode.window.showInformationMessage(message);
  }

  deactivate() {
    WebviewApi.deactivate();
  }
  /**
   *Get html from the file path and replace resources protocol to `vscode-resource`
   *
   * @param {string} htmlPath path of html path
   * @returns
   * @memberof WebView
   */
  getHtml4Path(htmlPath) {
    const dirPath = path.dirname(htmlPath);
    let html = fs.readFileSync(htmlPath, 'utf-8');
    html = html.replace(/(href=|src=)(.+?)(\ |>)/g, (m, $1, $2, $3) => {
      let uri = $2;
      uri = uri.replace('"', '').replace("'", '');
      uri.indexOf('/_nuxt') === 0 && (uri = `.${uri}`);
      if (uri.substring(0, 1) == '.') {
        const resourceUriOnDisk = vscode.Uri.file(path.resolve(dirPath, uri));
        const resourceUri = this.panel.webview.asWebviewUri(resourceUriOnDisk);
        uri = `${$1}${resourceUri}${$3}`;
        return uri.replace('%22', '');
      }
      return m;
    });
    return html;
  }

  prepareView(html, htmlPath) {
    html = html.replace(/(href=|src=)(.+?)(\ |>)/g, (m, $1, $2, $3) => {
      let uri = $2;
      uri = uri.replace('"', '').replace("'", '');
      uri.indexOf('/_nuxt') === 0 && (uri = `.${uri}`);
      if (uri.substring(0, 1) == '.') {
        const resourceUriOnDisk = vscode.Uri.file(path.resolve(path.dirname(htmlPath), uri));
        const resourceUri = this.panel.webview.asWebviewUri(resourceUriOnDisk);
        uri = `${$1}${resourceUri}${$3}`;
        return uri.replace('%22', '');
      }
      return m;
    });
    return html;
  }
}

module.exports = {
  WebView,
};