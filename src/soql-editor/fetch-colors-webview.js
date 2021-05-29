const vscode = require('vscode');
const axios = require('axios');
const Webview = require('../utilities/webview');
const path = require('path');

class FetchColorsWebview extends Webview{

    constructor(name) {
        super(
            name, 
            null,
            `<!doctype html>
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
            </html>`,
            vscode.ViewColumn.Two,
            true, 
            true, 
            false,
            path.join('views', 'fetch-colors'), 
            'info',
            true
        );
        this._colors;
        vscode.window.onDidChangeActiveColorTheme(() => this.activate(context));
    }

    sendColors(){
        return axios.post(`${process.env.SERVER_ENDPOINT}/vscode/notification/activecolortheme`, this._colors);
    }

    didReceiveMessage(colors){
        this._colors = colors;
        this._panel.dispose();
        this._panel = null;
        this.sendColors();
    }
}

module.exports = FetchColorsWebview;
