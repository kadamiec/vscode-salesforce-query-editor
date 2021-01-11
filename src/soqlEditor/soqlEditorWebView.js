// @ts-nocheck
const vscode = require('vscode');
const { WebView } = require('../vscode/vscode.webview');
const { outputChannel }  = require('./soqlEditorOutputChannel');
const {
  getDefaultusername,
  openRecordDetailPage,
  exportSourceTree
} = require('../services/sfdx.js');
const {
  getGlobalDescribe,
  getSObjectDescribe,
  getSOQLData,
  getSOQLDataAndSObjectDescribe,
  getSOQLPlan,
  updateRecords,
  deleteRecord
} = require('../services/salesforceAPI.js');

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
    this.configProperties = ['displayEditor', 'showFieldType', 'showFieldTypeTable', 'autoFormatSOQL', 'styleJSON'];
    this.defaultusername;
    this.activeTextEditor = vscode.window.activeTextEditor;
    this.editingSOQL = {
      start: 0,
      end: 0,
      soql: null
    };
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
      })
      .catch (error => {
        showErrorMessage("Could not fetch SObjects", error);            
      });
    };

    const setDefaultusername = () => {
      getDefaultusername()
      .then(defaultusername => {
        this.defaultusername = defaultusername;
        getSObjects();
      })
      .catch(error => {
        showErrorMessage('Could not get Defaultusername', error);
      });
    };

    this.onDidPose = () => {
      setDefaultusername();
      this.editingSOQL = findEditingSOQL(this.activeTextEditor);
      if(this.editingSOQL.start && this.editingSOQL.end){
        this.postMessage('editingSOQL', this.editingSOQL);
      }
    };

    this.didChangeViewState = () => {
      const editor = vscode.window.activeTextEditor;
      if(editor){
        const fileName = editor.document.fileName.split(/\/|\\/).pop();
        if(fileName.includes('.cls')){
          this.activeTextEditor = editor;
          this.editingSOQL = findEditingSOQL(this.activeTextEditor);
        }
      }
    };

    this.handler.addApi({
      openRecordDetailPage: (recordId) =>  openRecordDetailPage(recordId),
      refreshSObjects: () => getSObjects(),
      getSObjectDescribe: (sObject) => {
        getSObjectDescribe(sObject, this.defaultusername)
        .then((response) => {
          this.postMessage('sobjectDescription', response.data);
        })
        .catch(error =>{
          showErrorMessage('Could not get SObject Fields', error);
        });
      },
      executeSOQL: ({ soql, apiVersion }) => {
        getSOQLData(soql, apiVersion, this.defaultusername)
        .then((response) => {
            this.postMessage('soqlResult', response.data.records);
        })
        .catch((error) => {
          if (error.response.status === 400){
            this.postMessage('soqlResult', error.response.data[0]);
          }else{
            this.postMessage('soqlResult', []);
          }
        });
      },
      executeSOQL2: ({ soql, sObjectName, apiVersion }) => {
        getSOQLDataAndSObjectDescribe(soql, sObjectName, apiVersion, this.defaultusername)
        .then((response) => {
          this.postMessage('soqlResultAndSObjectDescribe', response.data.results);
        })
        .catch((error) => {
          this.postMessage('soqlResultAndSObjectDescribe', error.response.data[0]);
          showErrorMessage('Could not execute the Query');
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
      getEditingSOQL: () => {
        this.editingSOQL = findEditingSOQL(this.activeTextEditor);
        if(this.editingSOQL.start && this.editingSOQL.end){
          this.postMessage('editingSOQL', this.editingSOQL);
        }
      },
      setDocumentSOQL: ({ soql, isUpdate } ) => {
        soql = `[${soql.replace(/\s\s+|(\r\n)+|\r+|\n+|\t+/gm, ' ')}]`;
        if(!isUpdate){
          if(this.activeTextEditor && this.activeTextEditor.selection.isEmpty) {
            this.activeTextEditor.edit((editBuilder) => {
              editBuilder.insert(this.activeTextEditor.selection.active, soql);
            });
          }
        }else{
          this.editingSOQL = findEditingSOQL(this.activeTextEditor);
          if(this.editingSOQL.start && this.editingSOQL.end){
            const soqlRange = new vscode.Range(this.activeTextEditor.document.positionAt(this.editingSOQL.start), 
                                               this.activeTextEditor.document.positionAt(this.editingSOQL.end));
            this.activeTextEditor.edit((editBuilder) => {
              editBuilder.replace(soqlRange, soql);
            });
          }
        }
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
          
          
          let i,j;
          const chunk = 200;
          const commitChangesPromises = [];
          for (i = 0, j = recordsToUpdate.length; i < j; i += chunk) {
            const records = recordsToUpdate.slice(i, i + chunk); 
            commitChangesPromises.push(
              updateRecords({ allOrNone: false, records }, this.defaultusername)
            )
          }

          await Promise.all(commitChangesPromises)
          .then((results) => {
            const updatedRecordsResults = [];
            results.forEach((result) =>  updatedRecordsResults.push(...result.data))
            this.postMessage('commitResult', updatedRecordsResults);
          })
          .catch((error) => {
            showErrorMessage('Could not commit changes', error);
          })
        }
      },
      deleteRecord: ({ recordId, apiVersion, sObjectName }) => {
        deleteRecord(recordId, sObjectName, apiVersion, this.defaultusername)
        .then((result) => {
          this.postMessage('deleteResult', result.data);
        })
        .catch((error) => {
          if (error.response.status === 400){
            this.postMessage('deleteResult', error.response.data[0]);
          }else{
            showErrorMessage('Could not delete the record', error);
          }
        });
      },
      exportSourceTree: async({ soql, apiVersion }) => {
        return ApiPromise((resolve) => {
          exportSourceTree(soql.replace(/\s\s+|(\r\n)+|\r+|\n+|\t+/gm, ' '), apiVersion)
          .then((result) => resolve(result))
          .catch((error) => {
            resolve(error);
            showErrorMessage('Could not Export Source Tree', error);
          })
        });
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

  deactivate(){
    this.fileSystemWatcher.dispose();
  }

}

const ApiPromise = (callBack) => {
  return new Promise((resolve, reject) => {
    callBack(resolve, reject);
  });
};

const showErrorMessage = (message, error) => {
  if(error) outputChannel.appendLine(error);
  vscode.window.showErrorMessage(message, 'Show Output')
  .then((selection) => {
    if (selection === 'Show Output') {
      outputChannel.show();
    }
  });
}

const findEditingSOQL = (activeTextEditor) => {
  const position = { start: 0, end: 0, soql: null };
  if(!activeTextEditor) return position;
  const text = activeTextEditor.document.getText();
  const anchorPosition = activeTextEditor.document.offsetAt(activeTextEditor.selection.start);
  const soqlRegex = /\[(.+?)\]/gims;
  let match = soqlRegex.exec(text);
  while (match != null) {
    const start = match.index;
    const end = match.index + match[0].length;
    if(anchorPosition >= start && anchorPosition <= end){
      position.start = start;
      position.end = end;
      position.soql = match[0];
      break;
    }else{
      match = soqlRegex.exec(text);
    }
  }
  return position;
}

module.exports = SOQLEditorWebView;
