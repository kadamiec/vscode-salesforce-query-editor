import {
    Vscode
} from '../vscode.web';

/**
 *vscode API of business
 *
 * @class SoqlEditorExtensionApi
 * @extends {Vscode}
 */
class SoqlEditorExtensionApi extends Vscode {
    onLoading(callback){
        this.on('loading', callback, 0);
    }
    onReceiveObjects(callback) {
        this.on('objects', callback, 0);
    }
    onReceiveSObjectDescription(callback) {
        this.on('sobjectDescription', callback, 0);
    }
    onReceiveSOQLResult(callback) {
        this.on('soqlResult', callback, 0);
    }
    onReceiveSOQLPlan(callback){
        this.on('soqlPlan', callback, 0);
    }
}

export default SoqlEditorExtensionApi;
