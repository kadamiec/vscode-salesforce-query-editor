// @ts-nocheck
const vscode = require('vscode');
const axios = require('axios');

class Configuration {
    
    constructor(outputChannel){
        this._outputChannel = outputChannel;
        this._properties = {
            displayQueryBuilder: null,
            fieldType: null,
            field: null,
            format: null, 
            nestedResults: null,
            windowMode: null,
            displayTabs: null,
            queryOnClick: null,
            setQueryOnClick: null
        };
        this._context = null;
    }

    activate(context){
        this._context = context;
        vscode.workspace.onDidChangeConfiguration(() => {
            this.loadProperties();
            axios.post(`${process.env.SERVER_ENDPOINT}/vscode/notification/configuration`, this.properties)
                .catch((_) => this._outputChannel.appendLine('Could not delivery the Workspace Configuration.'));
        })
    }

    get properties(){
        this.loadProperties();
        return this._properties;
    }

    loadProperties(){
        Object.keys(this._properties).forEach((property) => {
            this._properties[property] = vscode.workspace.getConfiguration('salesforceQueryEditor').get(property)
        });
    }
}

module.exports = Configuration;