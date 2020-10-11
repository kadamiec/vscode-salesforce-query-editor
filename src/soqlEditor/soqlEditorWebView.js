// @ts-nocheck
const { WebView } = require('../vscode/vscode.webview');
const vscode = require('vscode');
const {
  getDefaultusername,
  getGlobalDescribe,
  getSObjectDescribe,
  getSOQLData,
  getSOQLPlan,
  openRecordDetailPage
} = require('../utils/sfdxCommands.js');

/**
 *Add business
 *
 * @class SOQLEditorWebView
 * @extends {WebView}
 */

class SOQLEditorWebView extends WebView {
  /**
   * Creates an instance of SOQLEditorWebView.
   * @memberof SOQLEditorWebView
   */

  constructor() {
    super();
    this.defaultOrg;
    this.activeTextEditor = vscode.window.activeTextEditor;

    this.fileSystemWatcher = vscode.workspace.createFileSystemWatcher(`**/.sfdx/sfdx-config.json`, true, false, true);
    this.fileSystemWatcher.onDidChange(() => {
      if(this.panel){
        this.postMessage('loading');
        this.onDidPose();
      }
    });

    this.onDidPose = () => {
      getDefaultusername().then(defaultOrg => {
        this.defaultOrg = defaultOrg;
        getGlobalDescribe(this.defaultOrg)
          .then((response) => {
            this.postMessage('objects', response.data.sobjects);
          }).catch ((e) => {
            this.showErrorMessage("Couldn't retrieve the Sobjects List");
            this.channel.appendLine(e);
        });
      }).catch(reason => this.showErrorMessage(reason));
    };

    this.didChangeViewState = () => {
      this.activeTextEditor = vscode.window.activeTextEditor;
    };

    this.handler.addApi({
      getAllObjectNames: () => {
        getGlobalDescribe(this.defaultOrg)
          .then((response) => {
            this.postMessage('objects', response.data.sobjects);
          }).catch ((e) => {
            this.showErrorMessage("Couldn't get the SObjects");
            this.channel.appendLine(e);
        });
      },
      refreshSObjects: () => {
        this.onDidPose();
      },
      getSObjectDescribe: (sObject) => {
        getSObjectDescribe(this.defaultOrg, sObject).then((response) => {
          this.postMessage('sobjectDescription', response.data);
        });
      },
      executeSOQL: (soql) => {
        getSOQLData(soql, this.defaultOrg)
          .then((response) => {
              this.postMessage('soqlResult', response.data.records);
          })
          .catch((reason) => {
              if (reason.response.status === 400){
                this.postMessage('soqlResult', reason.response.data[0]);
              }else{
                this.postMessage('soqlResult', []);
              }
          });
      },
      getSOQLPlan: (soql) => {
        getSOQLPlan(soql, this.defaultOrg)
          .then((response) => {
              this.postMessage('soqlPlan', response.data.plans);
          })
          .catch((reason) => {
              if (reason.response.status === 400){
                this.postMessage('soqlPlan', reason.response.data[0]);
              }else{
                this.postMessage('soqlPlan', []);
              }
          });
      },
      addToApex: (soql) => {
        const editor = this.activeTextEditor;
        if (editor.selection.isEmpty) {
          const position = editor.selection.active;
          editor.edit((editBuilder) => {
            soql = soql.replace(/\n/g, ' ');
            soql = soql.replace(/ +(?= )/g, ' ');
            editBuilder.insert(position, `[${soql}]`);
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

module.exports = SOQLEditorWebView;