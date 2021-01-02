// @ts-nocheck
const axios = require('axios');
const { outputChannel }  = require('../soqlEditor/soqlEditorOutputChannel');

axios.interceptors.response.use(
    function (response){
        outputChannel.appendLine('Status Code: ' + response.status);
        outputChannel.appendLine(JSON.stringify(response.config));
        return response;
    },
    function (error) {
        if (error.response) {
            outputChannel.appendLine('Status Code: ' + error.response.status);
            outputChannel.appendLine(JSON.stringify(error.response.data));
        } else if (error.request) {
            outputChannel.appendLine(JSON.stringify(error.request));
        } else {
            outputChannel.appendLine(error.message);
        }
        return Promise.reject(error);
    }
);

axios.interceptors.request.use(
  function (config) {
    outputChannel.appendLine('Resource: ' + config.url + ' Method: ' + config.method);
    return config;
  }
);

const buildQueryParams = (params) => {
    return Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&');
};

const createAxiosCall = (method, service, apiVersion, queryParams, data, defaultOrg) => {
    return axios({
        method,
        url: encodeURI(`${defaultOrg.instanceUrl}/services/data/${apiVersion || process.env.SALESFORCE_API_VERSION}/${service}/${queryParams ? buildQueryParams(queryParams) : ''}`),
        data,
        headers: {
            Authorization: `Bearer ${defaultOrg.accessToken}`
        }
    });
};

const getGlobalDescribe = (defaultOrg) => {
    return createAxiosCall('get', 'sobjects', null, null, null, defaultOrg);
};
  
const getSOQLPlan = (soql, apiVersion, defaultOrg) => {
    return createAxiosCall('get', 'query', apiVersion, {'?explain' : soql.replace(/\s+/g, '+')}, null, defaultOrg);
};

const getSOQLData = (soql, apiVersion, defaultOrg) => {
    return createAxiosCall('get', 'query', apiVersion, {'?q' : soql.replace(/\s+/g, '+')}, null, defaultOrg);
};

const getSObjectDescribe = (sObjectName, defaultOrg) => {
    return createAxiosCall('get', `sobjects/${sObjectName}/describe`, null, null, null, defaultOrg);
};

const updateRecords = (records, defaultOrg) => {
    return createAxiosCall('patch','composite/sobjects', null, null, records, defaultOrg);
};

const deleteRecord = (recordId, sObjectName, apiVersion, defaultOrg) => {
    return createAxiosCall('delete', `sobjects/${sObjectName}/${recordId}`, apiVersion, null, null, defaultOrg);
};

const getSOQLDataAndSObjectDescribe= (soql, sObjectName, apiVersion, defaultOrg) => {
    const requestBody = {
        "batchRequests" : [
            {
                "method" : "GET",
                "url" : `${apiVersion}/sobjects/${sObjectName}/describe/`
            },
            {
                "method" : "GET",
                "url" : `${apiVersion}/query?q=${soql.replace(/\s+/g, '+')}`
            }
        ]
    };

    return createAxiosCall('post', 'composite/batch', apiVersion, null, requestBody, defaultOrg);
};

module.exports = {
    getGlobalDescribe,
    getSObjectDescribe,
    getSOQLData,
    getSOQLDataAndSObjectDescribe,
    getSOQLPlan,
    updateRecords,
    deleteRecord
};