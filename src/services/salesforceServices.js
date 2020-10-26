// @ts-nocheck
const axios = require('axios');

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


module.exports = {
    getGlobalDescribe,
    getSObjectDescribe,
    getSOQLData,
    getSOQLPlan,
    updateRecords
};