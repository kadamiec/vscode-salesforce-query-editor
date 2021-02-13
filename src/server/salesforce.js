// @ts-nocheck
const axios = require('axios');
const routes = require('express').Router();
const CancelToken = axios.CancelToken;

let cancel;

routes.get("/:apiVersion/sobjects", async (req, res) => {
    const authorization = req.headers.authorization;
    const instanceurl = req.headers.instanceurl;
    const apiVersion = req.params.apiVersion;
    const endpoint = `${instanceurl}/services/data/${apiVersion || process.env.SALESFORCE_API_VERSION}/sobjects`;
    console.log(endpoint);
    try{
        const response = await axios.get(endpoint, {
            headers: {
                Authorization: authorization
            }
        });
        res.send(response.data);
    }catch(error){
        if(error.response.status === 400){
            res.status(400).send(error.response.data);
        }else{
            res.status(500).send({
                message: "Bad Request"
            })
        }
    }
});

routes.get("/:apiVersion/sobjects/:sobjectName", async (req, res) => {
    const authorization = req.headers.authorization;
    const instanceurl = req.headers.instanceurl;
    const apiVersion = req.params.apiVersion; 
    const sobjectName = req.params.sobjectName;
    const endpoint = `${instanceurl}/services/data/${apiVersion || process.env.SALESFORCE_API_VERSION}/sobjects/${sobjectName}/describe`;
    console.log(endpoint);

    try{
        const response = await axios.get(endpoint, {
            headers: {
                Authorization: authorization
            }
        });
        res.send(response.data);
    }catch(error){
        if(error.response.status === 400){
            res.status(400).send(error.response.data);
        }else{
            res.status(500).send({
                message: "Bad Request"
            })
        }
    }
});

routes.post("/:apiVersion/composite/batch", async (req, res) => {
    const batchRequests = req.body.batchRequests;
    const authorization = req.headers.authorization;
    const instanceurl = req.headers.instanceurl;
    const apiVersion = req.params.apiVersion;
    const endpoint = `${instanceurl}/services/data/${apiVersion || process.env.SALESFORCE_API_VERSION}/composite/batch`;
    const options = {
        cancelToken: new CancelToken(function executor(c) { cancel = c }),
        headers: {
            Authorization: authorization
        }
    };

    const requests = [];
    var i,j,batchRequestSlice,chunk = 25;
    for (i = 0, j = batchRequests.length; i < j; i += chunk) {
        batchRequestSlice = batchRequests.slice(i, i+chunk);
        batchRequestSlice.forEach((batchRequest) => batchRequest.url = batchRequest.url)
        const requestBody = {
            batchRequests: batchRequestSlice
        }
        requests.push(axios.post(endpoint, requestBody, options))
    }

    try{
        const responses = await Promise.all(requests);
        const allResponsesData = [];
        responses.forEach(response => {
            allResponsesData.push(response.data);
        })
        res.send(allResponsesData);
    }catch(error){
        if(error.response.status === 400){
            res.status(400).send(error.response.data);
        }else{
            res.status(500).send({
                message: "Bad Request"
            })
        }
    }
});

routes.patch("/:apiVersion/composite/sobjects", async (req, res) => {
    const changes = req.body.changes;
    const authorization = req.headers.authorization;
    const instanceurl = req.headers.instanceurl;
    const apiVersion = req.params.apiVersion;
    const endpoint = `${instanceurl}/services/data/${apiVersion || process.env.SALESFORCE_API_VERSION}/composite/sobjects`;
    const options = {
        headers: {
            Authorization: authorization
        }
    };
    
    const requests = [];
    let i,j;
    const chunk = 200;
    for (i = 0, j = changes.length; i < j; i += chunk) {
        const requestBody = {
            allOrNone: false, 
            records: changes.slice(i, i + chunk) 
        }
        requests.push(axios.patch(endpoint, requestBody, options));
    }

    try{
        const responses = await Promise.all(requests);
        const allResponsesData = [];
        responses.forEach(response => {
            allResponsesData.push(response.data);
        })
        res.send(allResponsesData);
    }catch(error){
        if(error.response.status === 400){
            res.status(400).send(error.response.data);
        }else{
            res.status(500).send({
                message: "Bad Request"
            })
        }
    }
});

routes.delete("/:apiVersion/sobjects/:sobjectName/:recordId", async (req, res) => {
    const authorization = req.headers.authorization;
    const instanceurl = req.headers.instanceurl;
    const apiVersion = req.params.apiVersion;
    const sobjectName = req.params.sobjectName;
    const recordId = req.params.recordId;
    const endpoint = `${instanceurl}/services/data/${apiVersion || process.env.SALESFORCE_API_VERSION}/sobjects/${sobjectName}/${recordId}`;
    console.log(endpoint);
    try{
        const response = await axios.delete(endpoint, {
            headers: {
                Authorization: authorization
            }
        });
        res.send(response.data);
    }catch(error){
        if(error.response.status === 400){
            res.status(400).send(error.response.data);
        }else{
            res.status(500).send({
                message: "Bad Request"
            })
        }
    }
});

routes.post("/:apiVersion/query", async (req, res) => {
    const authorization = req.headers.authorization;
    const instanceurl = req.headers.instanceurl;
    const apiVersion = req.params.apiVersion;
    const isExplain = req.query.explain || false;
    const soql = encodeURIComponent(req.body.soql);
    const endpoint = `${instanceurl}/services/data/${apiVersion || process.env.SALESFORCE_API_VERSION}/query?${isExplain ? 'explain=' : 'q='}${soql}`;
    try{
        const response = await axios.get(endpoint, {
            cancelToken: new CancelToken(function executor(c) { cancel = c }),
            params: req.query,
            headers: {
                Authorization: authorization
            }
        });
        res.send(response.data);
    }catch(error){
        if(error.response.status === 400){
            res.status(400).send(error.response.data);
        }else{
            res.status(500).send({
                message: "Bad Request"
            })
        }
    }
});

routes.get("/cancel", async(req, res) => {
    try{
        cancel();
        res.sendStatus(200);
    }catch(error){
        if(error.response.status === 400){
            res.status(400).send(error.response.data);
        }else{
            res.status(500).send({
                message: "Bad Request"
            })
        }
    }
});
    
module.exports = routes;