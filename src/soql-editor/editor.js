// @ts-nocheck
const vscode = require('vscode');
const axios = require('axios');

class Editor {

    constructor(){
        this._editor = vscode.window.activeTextEditor;
        this._editingSOQL = { start: 0, end: 0, soql: null };
        vscode.window.onDidChangeTextEditorSelection(() => {
            this.sendEditingSOQL();
        })
    }

    set editor(editor){
        this._editor = editor;
    }

    get active(){
        return vscode.window.activeTextEditor;
    }

    sendEditingSOQL(){
        if(this._editor){
            this._editingSOQL = this.getSOQL();
            axios.post(`${process.env.SERVER_ENDPOINT}/vscode/notification/editingsoql`, this._editingSOQL);
        }
    }

    setEditor(){
        const editor = this.active;
        if(editor){
            const fileName = editor.document.fileName.split(/\/|\\/).pop();
            if(fileName.includes('.cls')){
                this._editor = editor;
                this._editingSOQL = this.getSOQL();    
            }
        }
    }

    setSOQL(newSOQL){
        return new Promise((resolve) => {
            if(!this._editingSOQL.soql){
                if(this._editor && this._editor.selection.isEmpty) {
                    this._editor.edit((editBuilder) => {
                        editBuilder.insert(this._editor.selection.active, newSOQL);
                        resolve();
                    });
                }
            }else{
                this._editingSOQL = this.getSOQL();
                if(this._editingSOQL.start && this._editingSOQL.end){
                    const startPosition = this._editor.document.positionAt(this._editingSOQL.start);
                    const endPosition  = this._editor.document.positionAt(this._editingSOQL.end);
                    const soqlRange = new vscode.Range(startPosition, endPosition);
                    this._editor.edit((editBuilder) => {
                        editBuilder.replace(soqlRange, newSOQL);
                        this._editor.selection = new vscode.Selection(startPosition, endPosition);
                        resolve();
                    });
                }
            }
        })
    }

    getSOQL(){
        const position = { start: 0, end: 0, soql: null };
        if(!this._editor) return position;
        const text = this._editor.document.getText();
        const anchorPosition = this._editor.document.offsetAt(this._editor.selection.start);
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

}

module.exports = Editor;