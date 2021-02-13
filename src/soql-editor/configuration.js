const vscode  = require('vscode');

class Configuration {
    
    static _properties() {
        return [
            "displayEditor",
            "fieldType", 
            "format", 
            "nestedResults", 
            "groupSelectedFields",
            "windowMode"
        ];
    }
    constructor(){}

    get properties(){
        const properties = {};
        Configuration._properties().forEach((property) => {
            properties[property] = vscode.workspace.getConfiguration('soqlEditor').get(property)
        });
        return properties;
    }
}

module.exports = Configuration;