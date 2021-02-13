// @ts-nocheck
const axios = require('axios');
const { fingerprint } = require('./fingerprint');

class Keygen {

    constructor(licenseStorage){
        this._licenseStorage = licenseStorage;
        this._key;
        this._license;
    }

    async validate(){
        try{
            this._key = await this._licenseStorage.readFile('key.txt');
            if(this._key){
                try{
                    const response = await axios.post(
                        `https://api.keygen.sh/v1/accounts/${process.env.KEYGEN_ACCOUNT_ID}/licenses/actions/validate-key`,
                        {
                            meta: {
                                key: this._key,
                                scope: {
                                    fingerprint
                                }
                            }
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Accept: 'application/json',
                            }
                        }
                    )
                
                    this._license = response.data;
                }catch(error){
                    this._license = {
                        meta: {
                            valid: false
                        }
                    }
                }
            }else{
                this._license = {
                    meta: {
                        valid: false
                    }
                }
            }
        }catch(error){
            this._license = {
                meta: {
                    valid: false
                }
            }
        }
    }

    get isValid(){
        if(this._license && this._license.meta && this._license.meta.valid) return true;
        return false;
    }
}


module.exports = Keygen