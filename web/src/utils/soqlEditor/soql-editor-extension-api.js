import { Vscode } from '../vscode.web';

/**
 *vscode API of business
 *
 * @class SoqlEditorExtensionApi
 * @extends {Vscode}
 */
class SoqlEditorExtensionApi extends Vscode {
    onLoading(callback) {
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

    onReceiveSOQLResultAndSObjectDescribe(callback){
        this.on('soqlResultAndSObjectDescribe', callback, 0);
    }

    onReceiveSOQLPlan(callback) {
        this.on('soqlPlan', callback, 0);
    }

    onReceiveCommitResult(callback) {
        this.on('commitResult', callback, 0);
    }

    onReceiveDeleteResult(callback) {
        this.on('deleteResult', callback, 0);
    }

    onReceiveConfigurations(callback) {
        this.on('configurations', callback, 0);
    }

    onReceiveEditingSOQL(callback){
        this.on('editingSOQL', callback, 0);
    }

    
}

export default SoqlEditorExtensionApi;
