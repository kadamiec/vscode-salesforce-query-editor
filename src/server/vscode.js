// @ts-nocheck
const routes = require('express').Router();
const { fetchColorsWebview , editor, configuration, licenseStorage, loginStorage } = require('../soql-editor');
const { fingerprint } = require('../utilities/fingerprint');
const vscode = require('vscode');

routes.get("/fingerprint", (req, res) => {
    try{
        res.status(200).send({
            fingerprint
        })
    }catch(error){
        console.error(error);
        res.status(400).send({
            error: 'Could not create a determine the machine fingerprint'
        })
    }
});

routes.get("/configuration", (req, res) => {
    res.status(200).send(configuration.properties);
});

routes.get("/editor", (req, res) => {
    const editingSOQL = editor.getSOQL();
    if(editingSOQL && editingSOQL.soql){
        res.status(200).send({
            editingSOQL
        })
    }else{
        res.status(400).send({
            message: 'Could not retrieve the editing soql.'
        })
    }
})

routes.post("/editor", async(req, res) => {
    const soql = req.body.editingSOQL;
    try { 
        await editor.setSOQL(`[${soql.replace(/\s\s+|(\r\n)+|\r+|\n+|\t+/gm, ' ')}]`)
        res.status(200).send({
            message: 'SOQL updated.'
        });
    }catch(error){
        console.error(error);
        res.status(400).send({
            message: 'Could not set the SOQL in the document.'
        });
    }
});

routes.get("/license", async (req, res) => {
    try{
        const key = await licenseStorage.readFile('key.txt');
        res.status(200).send({
            key  
        })
    }catch(error){
        console.error(error);
        res.status(400).send({
            message: 'Could not read the key from the storage.'
        })
    }
})

routes.post("/license", async (req, res) => {
    try{
        await licenseStorage.writeFile('key.txt', req.body.key);
        res.status(200).send({
            message: 'Key saved with Success.' 
        })
    }catch(error){
        console.error(error);
        res.status(400).send({
            message: 'Could not save the key in the storage.'
        })
    }
})

routes.get("/login", async (req, res) => {
    try{
        const login = await loginStorage.readFile('login.txt');
        res.status(200).send({
            login: JSON.parse(login)
        })
    }catch(error){
        console.error(error);
        res.status(400).send({
            message: 'Could not read login credentials from the storage.'
        })
    }
})

routes.post("/login", async (req, res) => {
    try{
        await loginStorage.writeFile('login.txt', JSON.stringify(req.body.login));
        res.status(200).send({
            message: 'Login saved with Success.' 
        })
    }catch(error){
        console.error(error);
        res.status(400).send({
            message: 'Could not save login credentials in the storage.'
        })
    }
})

routes.delete("/license", async(req, res) => {
    try{
        await licenseStorage.deleteFile('key.txt');
        res.status(200).send({
            message: 'Key deleted with Success.' 
        })
    }catch(error){
        console.error(error);
        res.status(400).send({
            message: 'Could not delete the key in the storage.'
        })
    }
});

routes.post("/notification/:event", (req, res) => {
    const message = req.body;
    const event = req.params.event;
    const io = req.app.get('io');
    try{
        io.emit(event, message);
        res.sendStatus(200);
    }catch(error){
        console.error(error);
        res.sendStatus(400);
    }
})

routes.get("/colors", (req, res) => {
    try{
        res.status(200).send({
            colors: fetchColorsWebview._colors
        })
    }catch(error){
        console.error(error);
        res.status(400).send({
            message: 'Could not retrieve colors.'
        })
    }
})

routes.post("/page/open", async(req, res) => {
    try{
        await vscode.env.openExternal(vscode.Uri.parse(req.body.page))
    }catch(error){
        console.error(error);
        res.status(400).send({
            message: 'Could not open page.'
        })
    }
})

module.exports = routes;