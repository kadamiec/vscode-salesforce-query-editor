// @ts-nocheck
const axios = require('axios');

const buildQueryParams = (params) => {
    return Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&');
};

const createAxiosCall = (service, queryParams, defaultOrg)=>{
    return axios.get(
        encodeURI(`${defaultOrg.instanceUrl}/services/data/v${process.env.SALESFORCE_API_VERSION}/${service}/${queryParams ? buildQueryParams(queryParams) : ''}`),
        {
            headers: {
                Authorization: `Bearer ${defaultOrg.accessToken}`,
            },
        }
    );
};

const getGlobalDescribe = (defaultOrg) => {
    return createAxiosCall('sobjects', null, defaultOrg);
};
  
const getSOQLPlan = (soql, defaultOrg) => {
    return createAxiosCall('query', {'?explain' : soql.replace(/\s+/g, '+')}, defaultOrg);
};

const getSOQLData = (soql, defaultOrg) => {
    return createAxiosCall('query', {'?q' : soql.replace(/\s+/g, '+')}, defaultOrg);
};

const getSObjectDescribe = (sObjectName, defaultOrg) => {
    return createAxiosCall(`sobjects/${sObjectName}/describe`, null, defaultOrg);
};

module.exports = {
    getGlobalDescribe,
    getSObjectDescribe,
    getSOQLData,
    getSOQLPlan,
};