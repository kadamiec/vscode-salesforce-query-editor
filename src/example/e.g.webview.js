// @ts-nocheck
const { WebView } = require('../vscode/vscode.webview');
const vscode = require('vscode');
const {
  refreshSObjects,
  getOrgDisplay,
  getGlobalDescribe,
  callSObjectDescribe,
  executeSOQL,
  openRecordDetailPage
} = require('../lib/utils.js');
/**
 *Add business
 *
 * @class EGWebView
 * @extends {WebView}
 */

class EGWebView extends WebView {
  /**
   * Creates an instance of EGWebView.
   * @memberof EGWebView
   */

  constructor(reporter) {
    super();

    this.defaultOrg = getOrgDisplay();

    this.activeTextEditor = vscode.window.activeTextEditor;

    this.reporter = reporter;

    this.onDidPose = () => {
      this.defaultOrg = getOrgDisplay();
    };

    this.didChangeViewState = () => {
      this.activeTextEditor = vscode.window.activeTextEditor;
    };

    this.handler.addApi({
      getAllObjectNames: () => {
        try {
          getGlobalDescribe(this.defaultOrg).then((response) => {
            this.postMessage('objects', response.data.sobjects);
          });
        } catch (e) {
          this.showErrorMessage("Couldn't get the SObjects");
          this.channel.appendLine(e);
        }
      },
      refreshSObjects: () => {
        this.defaultOrg = getOrgDisplay();
        refreshSObjects(this.defaultOrg)
          .then((response) => {
            this.postMessage('objects', response.data.sobjects);
          })
          .catch((e) => {
            vscode.window
              .showErrorMessage("Couldn't Refresh SObjects", 'Show Output')
              .then((selection) => {
                if (selection === 'Show Output') {
                  this.channel.show();
                }
              });
            this.postMessage('objects');
            this.channel.appendLine(e);
          });
      },
      getSObjectDescribe: (sObject) => {
        callSObjectDescribe(this.defaultOrg, sObject).then((response) => {
          this.postMessage('sobjectDescription', response.data);
        });
      },
      executeSOQL: (soql) => {
        const start = new Date();
        executeSOQL(soql, this.defaultOrg)
          .then((response) => {
              this.postMessage('soqlResult', response.data.records);
              const elapsedTimeToQuery = new Date() - start;
              this.reporter.sendTelemetryEvent('executed-soql', {soql: soql}, {elapsedTimeToQuery: elapsedTimeToQuery });
          })
          .catch((reason) => {
              if (reason.response.status === 400){
                this.postMessage('soqlResult', reason.response.data[0]);
              }else{
                this.postMessage('soqlResult', []);
              }
              
              this.reporter.sendTelemetryException(reason, { soql: soql, response: reason });
          });
      },
      addToApex: (soql) => {
        // current editor
        const editor = this.activeTextEditor;

        // check if there is no selection
        if (editor.selection.isEmpty) {
          // the Position object gives you the line and character where the cursor is
          const position = editor.selection.active;
          editor.edit((editBuilder) => {
            soql = soql.replace(/\n/g, ' ');
            soql = soql.replace(/ +(?= )/g, ' ');
            editBuilder.insert(position, `[${soql}]`);
          });

          this.reporter.sendTelemetryEvent('add-to-apex', {
            soql: soql,
          });
        }
      },
      openRecordDetailPage: (recordId) =>{
        openRecordDetailPage(recordId);
      },
    });
  }

  /**
   * Activate
   * @param {import('vscode').ExtensionContext} context vscode extension context
   * @param {string} name webview name
   * @param {string} cmdName cmd name
   * @param {string} [htmlPath=path.join(context.extensionPath, 'web', 'dist', 'index.html')] html path
   * @returns {this}
   * @memberof WebView
   */
  activate(context, name, cmdName, htmlPath = undefined) {
    // custom code if need
    return super.activate(context, name, cmdName, htmlPath);
  }

  showErrorMessage(message) {
    vscode.window.showErrorMessage(message, 'Show Output').then((selection) => {
      if (selection === 'Show Output') {
        this.channel.show();
      }
    });
  }

  postMessage(message, data) {
    this.panel.webview.postMessage({
      cmd: message,
      data: data,
    });
  }
}

module.exports = EGWebView;
