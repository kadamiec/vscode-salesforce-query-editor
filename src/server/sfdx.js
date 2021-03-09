// @ts-nocheck
const routes = require('express').Router();
const { sfdx } = require('../soql-editor');

routes.get("/defaultusername", (req, res) => {
    sfdx.getDefaultusername()
    .then((response) => {
        res.status(200).send(response);
    })
    .catch((error) => {
        console.error(error);
        res.status(400).send({ error: 'Could not fetch Defaultusername'})
    });
});

routes.get("/config/:config", (req, res) => {
    const config = req.params.config;
    sfdx.getConfig(config)
    .then((response) => {
        res.status(200).send(response);
    })
    .catch((error) => {
        console.error(error);
        res.status(400).send({ error: `Could not fetch ${config} value`})
    });
});

routes.get("/orgs/:username", (req, res) => {
    const username = req.params.username;
    sfdx.getOrgDisplay(username)
    .then((response) => {
        res.status(200).send(response);
    })
    .catch((error) => {
        console.error(error); 
        res.status(400).send({ error: 'Could not fetch Username details'})
    });
});

routes.get("/orgs", (req, res) => {
    sfdx.getEnvironments()
    .then(response => {
        res.status(200).send(response);
    }).catch((error) => {
        console.error(error);
        res.status(400).send({ error: 'Could not fetch environments'});
    })
});

routes.post("/export/sourcetree/:apiVersion", (req, res) => {
    const username = req.body.username;
    const apiVersion = req.params.apiVersion;
    const soql = req.body.soql;
    sfdx.exportSourceTree(username, soql.replace(/\s\s+|(\r\n)+|\r+|\n+|\t+/gm, ' '), apiVersion)
    .then((response) => {
        res.status(200).send(response);
    })
    .catch((error) => {
        console.error(error);
        res.status(400).send({
            error: 'Could not export as Source Tree'
        })
    })
});

routes.post("/record/view", (req, res) => {
    const username = req.body.username;
    const recordId = req.body.recordId;
    sfdx.openPage(username, `/${recordId}`)
    .then(()=>{
        res.sendStatus(200);
    })
    .catch((error) => {
        console.error(error);
        res.status(400).send({
            error: 'Could not open the record id'
        })
    })
});


routes.post("/record/new", (req, res) => {
    const username = req.body.username;
    const sobjectKeyPrefix = req.body.sobjectKeyPrefix;
    sfdx.openPage(username, `${sobjectKeyPrefix}/e`)
    .then(()=>{
        res.sendStatus(200);
    })
    .catch((error) => {
        console.error(error);
        res.status(400).send({
            error: 'Could not open the New Record Page'
        })
    })
});

module.exports = routes;