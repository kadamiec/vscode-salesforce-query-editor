import { MD5 } from 'object-hash'

export default {
  async login({ commit }, { email, password }) {
    // Base64 encode the email/password for Authorization header
    const credentials = window.btoa(`${email}:${MD5(password)}`)

    try{
      // Create the token
      const response = await this.$axios.post(
        `https://api.keygen.sh/v1/accounts/${process.env.KEYGEN_ACCOUNT_ID}/tokens`,
        {},
        {
          headers: {
            'Content-Type': 'application/vnd.api+json',
            Accept: 'application/vnd.api+json',
            Authorization: `Basic ${credentials}`,
          }
        }
      )
      commit('setAuth', {...response.data.data.attributes, email })

      return response;
    }catch(error){
      console.error(error);
    }   
  },
  async validateLicense({ commit }, { key }) {
    try{
      const response = await this.$axios.post(
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
  
      commit('setLicense', {
        meta: response.data.meta,
        data: response.data.data,
      })

      return response;
    }catch(error){
      console.error(error);
      commit('setLicense', {
        status: 'invalid',
        errors,
      })
    }
  },
  async deleteLicense({ commit }, { licenseId }){
    try{
      const response = await this.$axios.delete(
        `https://api.keygen.sh/v1/accounts/${process.env.KEYGEN_ACCOUNT_ID}/licenses/${licenseId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state.auth.token}`,
          }
        }
      )

      return response;
    }catch(error){
      console.error(error);
    }
  },
  async fetchLicenses({ state, commit }){
    try{
      const response = await this.$axios.get(
        `https://api.keygen.sh/v1/accounts/${process.env.KEYGEN_ACCOUNT_ID}/licenses`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state.auth.token}`,
          }
        }
      )
      
      commit('setLicenses', response.data.data);
      return response;
    }catch(error){
      console.error(error);
    }
  },
  activateMachine({ state }, { key }) {
    const response = this.$axios.post(
      `${process.env.WEBHOOKS_SERVER}/activate-machine`,
      {
        fingerprint: state.fingerprint,
        key,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      }
    )

    return response;
  },
  fetchConfiguration({ commit }) {
    this.$axios
      .get(`${process.env.SALESFORCE_API_ENDPOINT}/vscode/configuration`)
      .then((result) => {
        commit('setConfiguration', result.data)
      })
      .catch((error) => {
        console.error(error)
      })
  },
  fetchMachineFingerprint({ commit }) {
    this.$axios
      .get(`${process.env.SALESFORCE_API_ENDPOINT}/vscode/fingerprint`)
      .then((response) => {
        commit('setFingerprint', response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  },
  saveLicense({}, { key }){
    this.$axios.post(
      `${process.env.SALESFORCE_API_ENDPOINT}/vscode/license`, 
      {
        key
      }
    )
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    })
  },
  fetchLicense({ commit }){
    const response = this.$axios.get(`${process.env.SALESFORCE_API_ENDPOINT}/vscode/license`)
    .then((response) => {
      console.log(response);
      commit('setLicensekey', { key: response.data.key });
    })
    .catch((error) => {
      console.error(error);
    })

    return response;
  }
}
