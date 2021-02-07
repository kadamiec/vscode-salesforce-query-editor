const soqlEditor = require('./soqlEditor');
const { startServer } = require('./server');
const Keygen = require('./keygen');

const activate = async (context) => {
    soqlEditor.activate(context);

    const keygen = new Keygen(soqlEditor.licenseStorage);
    await keygen.validate();

    startServer(soqlEditor.logsStorage.path, keygen);
}

const deactivate = () => {
    soqlEditor.deactivate();
}

module.exports = {
    activate,
    deactivate
};