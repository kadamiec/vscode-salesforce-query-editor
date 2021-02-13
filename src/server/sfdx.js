// @ts-nocheck
const routes = require('express').Router();
const { 
    getDefaultusername,
    getEnvironments,
    getOrgDisplay,
    getConfig,
    exportSourceTree,
    openRecordDetailPage
} =  require('../utilities/sfdx');

routes.get("/defaultusername", (req, res) => {
    getDefaultusername()
    .then((response) => {
        res.status(200).send(response);
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send({ error: 'Could not fetch Defaultusername'})
    });
});

routes.get("/config/:config", (req, res) => {
    const config = req.params.config;
    getConfig(config)
    .then((response) => {
        res.status(200).send(response);
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send({ error: `Could not fetch ${config} value`})
    });
});

routes.get("/orgs/:username", (req, res) => {
    const username = req.params.username;
    getOrgDisplay(username)
    .then((response) => {
        res.status(200).send(response);
    })
    .catch((error) => {
        console.error(error); 
        res.status(500).send({ error: 'Could not fetch Username details'})
    });
});

routes.get("/orgs", (req, res) => {
    getEnvironments()
    .then(response => {
        res.status(200).send(response);
    }).catch((error) => {
        console.error(error);
        res.status(500).send({ error: 'Could not fetch environments'});
    })
});

routes.post("/export/sourcetree/:apiVersion", (req, res) => {
    const apiVersion = req.params.apiVersion;
    const soql = req.body.soql;
    exportSourceTree(soql.replace(/\s\s+|(\r\n)+|\r+|\n+|\t+/gm, ' '), apiVersion)
    .then((response) => {
        res.status(200).send(response);
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send({
            error: 'Could not export as Source Tree'
        })
    })
});

routes.get("/open/record/:recordId", (req, res) => {
    const recordId = req.params.recordId;
    openRecordDetailPage(recordId)
    .then(()=>{
        res.sendStatus(200);
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send({
            error: 'Could not open the record id'
        })
    })
});

module.exports = routes;