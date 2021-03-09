// @ts-nocheck
const vscode = require('vscode');
const axios = require('axios');

class FetchColorsWebview {

    constructor() {
        this._name = 'fetch-colors-webview';
        this._panel;
        this._colors;
    }

    activate() {
        vscode.window.onDidChangeActiveColorTheme(() => this.showPanel());
        this.showPanel();
    }

    deactivate(){}

    sendColors(){
        return axios.post(`${process.env.SERVER_ENDPOINT}/vscode/notification/activecolortheme`, this._colors);
    }

    showPanel() {
        if (this._panel) {
            this._panel.reveal(vscode.ViewColumn.Three);
        } else {
            this._panel = vscode.window.createWebviewPanel(
                this._name,
                this._name,
                vscode.ViewColumn.Three,
                {
                    enableScripts: true,
                }
            );

            this._panel.webview.html = `<!doctype html>
            <html>
            <body>
                <script>
                const vscode = acquireVsCodeApi();
                const colors = {};
                Object.values(document.getElementsByTagName('html')[0].style).forEach(
                    (rv) => {
                    colors[rv] = document
                        .getElementsByTagName('html')[0]
                        .style.getPropertyValue(rv)
                    }
                )
                vscode.postMessage(colors);
                </script>
            </body>
            </html>`;

            this._panel.webview.onDidReceiveMessage((colors)=>{
                this._colors = colors;
                this._panel.dispose();
                this._panel = null;
                this.sendColors()
            })
        }
    }

}

module.exports = FetchColorsWebview;
