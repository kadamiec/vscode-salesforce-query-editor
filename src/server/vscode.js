// @ts-nocheck
const routes = require('express').Router();
const { fetchColorsWebview, editor, configuration } = require('../soql-editor');
const vscode = require('vscode');

routes.get("/configuration", (req, res) => {
    res.status(200).send(configuration.properties);
});

routes.get("/editor", (req, res) => {
    const editingSOQL = editor.getSOQL();
    if (editingSOQL && editingSOQL.soql) {
        res.status(200).send({
            editingSOQL
        })
    } else {
        res.status(400).send({
            message: 'Could not retrieve the editing soql.'
        })
    }
})

routes.post("/editor", async (req, res) => {
    const soql = req.body.editingSOQL;
    try {
        await editor.setSOQL(`[${soql.replace(/\s\s+|(\r\n)+|\r+|\n+|\t+/gm, ' ')}]`)
        res.status(200).send({
            message: 'SOQL updated.'
        });
    } catch (error) {
        console.error(error);
        res.status(400).send({
            message: 'Could not set the SOQL in the document.'
        });
    }
});

routes.post("/notification/:event", (req, res) => {
    const message = req.body;
    const event = req.params.event;
    const io = req.app.get('io');
    try {
        io.emit(event, message);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(400);
    }
})

routes.get("/colors", (req, res) => {
    try {
        res.status(200).send({
            colors: fetchColorsWebview._colors
        })
    } catch (error) {
        console.error(error);
        res.status(400).send({
            message: 'Could not retrieve colors.'
        })
    }
})

routes.post("/page/open", async (req, res) => {
    try {
        await vscode.env.openExternal(vscode.Uri.parse(req.body.page))
    } catch (error) {
        console.error(error);
        res.status(400).send({
            message: 'Could not open page.'
        })
    }
})

module.exports = routes;