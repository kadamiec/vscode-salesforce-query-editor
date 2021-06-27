"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// import the webdriver and the high level browser wrapper
const vscode_extension_tester_1 = require("vscode-extension-tester");
// Create a Mocha suite
describe('My Test Suite', () => {
    let driver;
    // initialize the browser and webdriver
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        driver = vscode_extension_tester_1.VSBrowser.instance.driver;
    }));
    // test whatever we want using webdriver, here we are just checking the page title
    it('My Test Case', () => __awaiter(void 0, void 0, void 0, function* () {
        const terminalView = yield new vscode_extension_tester_1.BottomBarPanel().openTerminalView();
        yield terminalView.executeCommand('code extension_test');
        yield new vscode_extension_tester_1.Workbench().executeCommand('SFDX: Open Salesforce Query Editor');
    }));
});
//# sourceMappingURL=query-editor-spec.js.map