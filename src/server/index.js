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

const startServer = async(logsStoragePath, keygen) => {
    const app = express();
    app.use(cors());
    app.use(bodyParser.json({ type: "application/vnd.api+json" }));
    app.use(bodyParser.json({ type: "application/json" }));

    var logsStream = rfs.createStream('server.log', {
        interval: '1d',
        path: logsStoragePath,
        maxSize: '10M'
    })

    morganBody(app, {
        noColors: true,
        stream: logsStream,
        maxBodyLength: '10000',
        prettify: process.env.NODE_ENV !== 'production'
    });

    const http = require('http').Server(app);

    if(keygen.isValid){
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
    }      
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