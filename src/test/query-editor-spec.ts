// import the webdriver and the high level browser wrapper
import { VSBrowser, WebDriver, Workbench, BottomBarPanel } from 'vscode-extension-tester';

// Create a Mocha suite
describe('My Test Suite', () => {
    let driver: WebDriver

    // initialize the browser and webdriver
    before(async () => {
        driver = VSBrowser.instance.driver;
    });

    // test whatever we want using webdriver, here we are just checking the page title
    it('My Test Case', async () => {
        const terminalView = await new BottomBarPanel().openTerminalView();
        await terminalView.executeCommand('code extension_test');
        await new Workbench().executeCommand('SFDX: Open Salesforce Query Editor');
    });
});