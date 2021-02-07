// @ts-nocheck
const routes = require('express').Router();
const crypto  = require('crypto');
const { machineIdSync } = require('node-machine-id');
const { licenseStorage } = require('../soqlEditor');
const { webview, editor, configuration } = require('../soqlEditor');

routes.get("/fingerprint", (req, res) => {
    try{
        res.status(200).send({
            fingerprint: crypto.createHash('sha512').update(machineIdSync({ original: true })).digest('hex')
        })
    }catch(error){
        console.error(error);
        res.status(500).send({
            error: 'Could not create a determine the machine fingerprint'
        })
    }
});

routes.get("/configuration", (req, res) => {
    res.status(200).send(configuration.properties);
});

routes.post("/activeEditor", (req, res) => {
    if(webview && req.body.editorName){
        webview.activeEditorName = req.body.editorName;
        res.sendStatus(200);
    }else{
        res.status(400).send({
            message: 'Could not set the Active Editor.'
        })
    }
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

routes.post("/editor", (req, res) => {
    const soql = req.body.editingSOQL;
    editor.setSOQL(`[${soql.replace(/\s\s+|(\r\n)+|\r+|\n+|\t+/gm, ' ')}]`)
    .then(() => {
        res.status(200).send({
            message: 'SOQL updated.'
        });
    })
    .catch(() => {
        res.status(400).send({
            message: 'Could not set the SOQL in the document.'
        });
    })
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
    const key = req.body.key;
    try{
        await licenseStorage.writeFile('key.txt', key);
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

module.exports = routes;