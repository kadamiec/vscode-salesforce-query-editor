// @ts-nocheck
const dotenv = require('dotenv');
const axios = require('axios');
const express = require("express");
const morganBody = require("morgan-body");
const bodyParser = require("body-parser");
const rfs = require('rotating-file-stream');
const cors = require('cors');
const sfdxRoutes = require('./sfdx');
const vscodeRoutes = require('./vscode');
const salesforceRoutes = require('./salesforce');
const dateFormat = require('dateformat');
const { logsStorage, outputChannel } = require('../soql-editor/index');

if(process.env.NODE_ENV !== 'production'){
    dotenv.config();
}

axios.interceptors.response.use(
    function (response){
        console.log('Status Code: ' + response.status);
        return response;
    },
    function (error) {
        if (error.response) {
            console.log('Status Code: ' + error.response.status);
        } else if (error.request) {
            console.log(JSON.stringify(error.request));
        } else if(error.message){
            console.log(error.message);
        }
        return Promise.reject(error);
    }
);

axios.interceptors.request.use(
  function (config) {
    console.log(`[${config.method.toUpperCase()}]  ${config.url}`);
    return config;
  }
);


const startServer = async() => {
    const app = express();
    app.use(cors());
    app.use(bodyParser.json({ type: "application/vnd.api+json" }));
    app.use(bodyParser.json({ type: "application/json" }));

    var logsStream = rfs.createStream('server.log', {
        interval: '1d',
        path: logsStorage.path,
        maxSize: '10M'
    })

    morganBody(app, {
        noColors: true,
        stream: logsStream,
        maxBodyLength: '10000',
        prettify: process.env.NODE_ENV !== 'production'
    });

    const http = require('http').Server(app);

    const io = require('socket.io')(http, {
        serveClient: false,
        cors: {
            origins: 'vscode-webview://*'
        }
    });
    io.on('connect', () => {
        console.log('connected');
    });
    app.set('io', io);
    
    app.use((req, res, next) => {
        outputChannel.appendLine(`${dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")} : [${req.method}] ${req.originalUrl}`);
        if(Object.keys(req.body) && Object.keys(req.body).length) outputChannel.appendLine(JSON.stringify(req.body));
        let oldSend = res.send
        res.send = function(data){
            new Promise((resolve) => {
                outputChannel.appendLine(`${dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")} : ${JSON.stringify(data)}`);
                resolve();
            })
            res.send = oldSend;
            return res.send(data);
        }
        next();
    });

    app.get('/', (req, res) => {
        res.sendStatus(200);
    })

    app.use('/salesforce', salesforceRoutes);
    app.use('/vscode', vscodeRoutes);
    app.use('/sfdx', sfdxRoutes);

    http.listen(process.env.PORT || 5000, 'localhost', () => {
        const { address, port } = http.address();
        console.log(`Listening at http://${address}:${port}`);    
    });
}
module.exports = {
    startServer
}