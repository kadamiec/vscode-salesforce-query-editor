// @ts-nocheck
const { WebView } = require('../vscode/vscode.webview');
const vscode = require('vscode');

const {
  getDefaultusername,
  openRecordDetailPage
} = require('../services/sfdxServices.js');
const {
  getGlobalDescribe,
  getSObjectDescribe,
  getSOQLData,
  getSOQLPlan,
  updateRecords
} = require('../services/salesforceServices.js');

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
    this.configProperties = ['displayEditor'];
    this.defaultusername;
    this.activeTextEditor = vscode.window.activeTextEditor;
    this.fileSystemWatcher = vscode.workspace.createFileSystemWatcher(`**/.sfdx/sfdx-config.json`, true, false, true);
    this.fileSystemWatcher.onDidChange(() => {
      if(this.panel){
        this.postMessage('loading');
        setDefaultusername();
      }
    });

    const getSObjects = () => {
      getGlobalDescribe(this.defaultusername)
        .then((response) => {
          this.postMessage('objects', response.data.sobjects);
        }).catch ((e) => {
          this.channel.appendLine(e);
          this.showErrorMessage("Couldn't get SObjects");            
        });
    };

    const setDefaultusername = () => {
      getDefaultusername()
        .then(defaultusername => {
          this.defaultusername = defaultusername;
          getSObjects();
        }).catch(reason => {
          this.channel.appendLine(reason);
          this.showErrorMessage('Could not get Defaultusername Credentials');
        });
    };

    this.onDidPose = () => {
      setDefaultusername();
    };

    this.didChangeViewState = () => {
      const editor = vscode.window.activeTextEditor;
      if(editor){
        const fileName = editor.document.fileName.split(/\/|\\/).pop();
        if(fileName.includes('.cls')){
          this.activeTextEditor = editor;
        }
      }
    };

    this.handler.addApi({
      getAllObjectNames: () => getSObjects(),
      refreshSObjects: () => setDefaultusername(),
      getSObjectDescribe: (sObject) => {
        if(sObject){
          getSObjectDescribe(sObject, this.defaultusername)
            .then((response) => {
              this.postMessage('sobjectDescription', response.data);
            }).catch((reason) =>{
              this.channel.appendLine(reason);
              this.showErrorMessage('Could not get SObject Fields');
            });
        }
      },
      executeSOQL: ({ soql, apiVersion }) => {
        getSOQLData(soql, apiVersion, this.defaultusername)
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
      getSOQLPlan: ({ soql, apiVersion }) => {
        getSOQLPlan(soql, apiVersion, this.defaultusername)
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
        if(this.activeTextEditor && this.activeTextEditor.selection.isEmpty) {
          const position = this.activeTextEditor.selection.active;
          this.activeTextEditor.edit((editBuilder) => {
            editBuilder.insert(position, `[${soql.replace(/  +|\n|\s\s+/g, ' ')}]`);
          });
        }
      },
      openRecordDetailPage: (recordId) =>{
        openRecordDetailPage(recordId);
      },
      commitChanges: async (changes) => {
        let sobject = changes.sobject;
        let recordsToUpdate = changes.recordsToUpdate;

        if(recordsToUpdate){
          recordsToUpdate = 
            recordsToUpdate.map(record => {
                for(var key in record) {
                  if(typeof record[key] === 'object') delete record[key];
                }
                record.attributes = {
                  type: sobject
                };
                return record;
            });

          let i,j,temparray,chunk = 200;
          let updatedRecordsResults = [];
          for (i = 0, j = recordsToUpdate.length; i < j; i += chunk) {
              temparray = recordsToUpdate.slice(i, i + chunk); 
              const result = await updateRecords(
                { 
                  allOrNone: false, 
                  records: temparray 
                }, 
                this.defaultusername
              );
              updatedRecordsResults.push(...result.data);
          }
          
          this.postMessage('commitResult', updatedRecordsResults);
        }
      },
      getConfigurations: () => {
        const configurations = {}
        this.configProperties.forEach((configProperty) => {
          configurations[configProperty] = vscode.workspace.getConfiguration('soqlEditor').get(configProperty)
        });
        this.postMessage('configurations', configurations);
      }
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
    return super.activate(context, name, cmdName, htmlPath);
  }

  showErrorMessage(message) {
    vscode.window.showErrorMessage(message, 'Show Output')
      .then((selection) => {
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
