// @ts-nocheck
const axios = require('axios');
const routes = require('express').Router();

routes.get('/license/validate/:key', async (req, res) => {
    const key = req.params.key;
    if(!key) res.status(400).send({
        message: 'The license key is required.'
    })
    try{
        const response = await axios.post(
            `https://api.keygen.sh/v1/accounts/${process.env.KEYGEN_ACCOUNT_ID}/licenses/actions/validate-key`,
            {
                meta: {
                    key,
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                }
            }
        )
        res.status(200).send(response.data);
    }catch(error){
        res.status(400).send({
            message: 'Could not validate your License.'
        })
    }
});

module.exports = routes;
