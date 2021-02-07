export default {
  async fetchSObjects({ commit, state }, { apiVersion, username }) {
    try {
      const response = await this.$axios.get(
        `${process.env.SALESFORCE_API_ENDPOINT}/salesforce/${
          apiVersion || process.env.SALESFORCE_API_VERSION
        }/sobjects`,
        {
          headers: {
            Authorization: `Bearer ${state.environments[username].accessToken}`,
            instanceUrl: state.environments[username].instanceUrl,
          },
        }
      )
      commit('setSObjects', { sobjects: response.data.sobjects, username })
      return response
    } catch (error) {
      console.error(error)
    }
  },
  async fetchSObjectFields(
    { commit, state, dispatch },
    { sobjectName, username, apiVersion }
  ) {
    const sobjectNameLowerCase = sobjectName.toLowerCase()
    if (
      !state.environments[username].sobjectsRequests[sobjectNameLowerCase] ||
      state.environments[username].sobjectsRequests[sobjectNameLowerCase]
        .status !== 'success'
    ) {
      try {
        const response = await this.$axios.get(
          `${process.env.SALESFORCE_API_ENDPOINT}/salesforce/${
            apiVersion || process.env.SALESFORCE_API_VERSION
          }/sobjects/${sobjectNameLowerCase}`,
          {
            headers: {
              Authorization: `Bearer ${state.environments[username].accessToken}`,
              instanceUrl: state.environments[username].instanceUrl,
            },
          }
        )

        if (response.data && response.data.name && response.data.fields)
          commit('setSObjectRequests', {
            sobjectName: sobjectNameLowerCase,
            status: 'success',
            username,
          })
        else
          commit('setSObjectRequests', {
            sobjectName: sobjectNameLowerCase,
            status: 'error',
            username,
          })

        commit('setSObject', { sobject: response.data, username })

        dispatch('fetchSObjectsFields', {
          fields: response.data.fields,
          apiVersion,
          username,
        })
        return response
      } catch (error) {
        console.error(error)
      }
    }
  },
  async fetchSObjectsFields(
    { commit, state },
    { fields, apiVersion, username }
  ) {
    let sobjects = []
    fields.forEach((field) => {
      field.referenceTo.forEach((reference) => {
        const referenceDetails =
          state.environments[username].sobjectsWithDetails[
            reference.toLowerCase()
          ]
        if (!referenceDetails) {
          sobjects.push(reference)
        }
      })
    })
    sobjects = [...new Set(sobjects)]
    const batchRequests = []
    sobjects.forEach((sobjectName) => {
      const sobjectNameLowerCase = sobjectName.toLowerCase()
      if (
        !state.environments[username].sobjectsWithDetails[
          sobjectNameLowerCase
        ] ||
        !state.environments[username].sobjectsRequests[sobjectNameLowerCase] ||
        state.environments[username].sobjectsRequests[sobjectNameLowerCase]
          .status !== 'success'
      ) {
        batchRequests.push({
          method: 'GET',
          url: `${
            apiVersion || process.env.SALESFORCE_API_VERSION
          }/sobjects/${sobjectName}/describe/`,
        })
      }
    })

    if (batchRequests.length) {
      try {
        const responses = await this.$axios.post(
          `${process.env.SALESFORCE_API_ENDPOINT}/salesforce/${
            apiVersion || process.env.SALESFORCE_API_VERSION
          }/composite/batch`,
          {
            batchRequests,
          },
          {
            headers: {
              Authorization: `Bearer ${state.environments[username].accessToken}`,
              instanceUrl: state.environments[username].instanceUrl,
            },
          }
        )

        console.log(responses.data)

        responses.data.forEach((response) => {
          const results = response.results
          results.forEach((result) => {
            const sobjectDetails = result.result
            const sobjectNameFromResponseLowerCase = sobjectDetails.name.toLowerCase()
            if (sobjectNameFromResponseLowerCase && sobjectDetails.fields)
              commit('setSObjectRequests', {
                sobjectName: sobjectNameFromResponseLowerCase,
                status: 'success',
                username,
              })
            else
              commit('setSObjectRequests', {
                sobjectName: sobjectNameFromResponseLowerCase,
                status: 'error',
                username,
              })

            commit('setSObject', { sobject: sobjectDetails, username })
          })
        })

        return responses
      } catch (error) {
        console.error(error)
      }
    }
  },
  async fetchSOQLAndSObject(
    { commit, state, dispatch },
    { soql, sobjectName, apiVersion, username }
  ) {
    const batchRequests = [
      {
        method: 'GET',
        url: `${
          apiVersion || process.env.SALESFORCE_API_VERSION
        }/sobjects/${sobjectName}/describe/`,
      },
      {
        method: 'GET',
        url: `${
          apiVersion || process.env.SALESFORCE_API_VERSION
        }/query?q=${soql.replace(/\s+/g, '+')}`,
      },
    ]

    try {
      const responses = await this.$axios.post(
        `${process.env.SALESFORCE_API_ENDPOINT}/salesforce/${
          apiVersion || process.env.SALESFORCE_API_VERSION
        }/composite/batch`,
        {
          batchRequests,
        },
        {
          headers: {
            Authorization: `Bearer ${state.environments[username].accessToken}`,
            instanceUrl: state.environments[username].instanceUrl,
          },
        }
      )

      const response = responses.data[0]
      const results = response.results
      const sobjectResponse = results[0]
      if (sobjectResponse.statusCode === 200) {
        commit('setSObject', { sobject: sobjectResponse.result, username })
        dispatch('fetchSObjectsFields', {
          fields: sobjectResponse.result.fields,
          apiVersion,
          username,
        })
      }
      return responses
    } catch (error) {
      console.error(error)
    }
  },
  async fetchSOQLPlan({ state }, { soql, apiVersion, username }) {
    try {
      const response = await this.$axios.post(
        `${process.env.SALESFORCE_API_ENDPOINT}/salesforce/${
          apiVersion || process.env.SALESFORCE_API_VERSION
        }/query?explain=true`,
        {
          soql
        },
        {
          headers: {
            Authorization: `Bearer ${state.environments[username].accessToken}`,
            instanceUrl: state.environments[username].instanceUrl,
          },
        }
      )

      return response
    } catch (error) {
      console.error(error)
    }
  },
  updateRecords({ state }, { changes, apiVersion, username }) {
    return this.$axios.patch(
      `${process.env.SALESFORCE_API_ENDPOINT}/salesforce/${
        apiVersion || process.env.SALESFORCE_API_VERSION
      }/composite/sobjects`,
      {
        changes,
      },
      {
        headers: {
          Authorization: `Bearer ${state.environments[username].accessToken}`,
          instanceUrl: state.environments[username].instanceUrl,
        },
      }
    )
  },
  deleteRecord({ state }, { recordId, sobjectName, apiVersion, username }) {
    return this.$axios.delete(
      `${process.env.SALESFORCE_API_ENDPOINT}/salesforce/${
        apiVersion || process.env.SALESFORCE_API_VERSION
      }/sobjects/${sobjectName}/${recordId}`,
      {
        headers: {
          Authorization: `Bearer ${state.environments[username].accessToken}`,
          instanceUrl: state.environments[username].instanceUrl,
        },
      }
    )
  },
  fetchDefaultusername({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`${process.env.SALESFORCE_API_ENDPOINT}/sfdx/defaultusername`)
        .then(async (response) => {
          try {
            commit('setDefaultusername', response.data.result)
            commit('setEnvironmentDetails', response.data.result)
            commit('setSelectedUsername', {
              editorName: 'editor-0',
              username: response.data.result.username,
            })
            commit('setApiVersion', response.data.result.apiVersion)
            await dispatch('fetchSObjects', {
              apiVersion: response.data.result.apiVersion,
              username: response.data.result.username,
            })
            commit('setEditorLoadingState', { editorName: 'editor-0' , isLoading: false })
            resolve(response)
          } catch (error) {
            console.error(error)
            reject(error)
          }
        })
        .catch((error) => {
          console.error(error)
          reject(error)
        })
    })
  },
  fetchEnvironments({ commit }) {
    this.$axios
      .get(`${process.env.SALESFORCE_API_ENDPOINT}/sfdx/orgs`)
      .then((response) => {
        const nonScratchOrgs = response.data.result.nonScratchOrgs || []
        const scratchOrgs = response.data.result.scratchOrgs || []
        const environments = nonScratchOrgs.concat(scratchOrgs)
        if (environments.length) commit('setEnvironments', environments)
      })
      .catch((error) => {
        console.error(error)
      })
  },
  fetchEnvironmentDetails({ commit }, { username, editorName }) {
    this.$axios
      .get(`${process.env.SALESFORCE_API_ENDPOINT}/sfdx/orgs/${username}`)
      .then((response) => {
        commit('setEnvironmentDetails', response.data.result)
        commit('setSelectedUsername', { editorName, username })
      })
      .catch((error) => {
        console.error(error)
      })
  },
  async cancelRequest({ state }) {
    try {
      const response = await this.$axios.get(
        `${process.env.SALESFORCE_API_ENDPOINT}/salesforce/cancel`,
        {
          headers: {
            Authorization: `Bearer ${state.defaultusername.accessToken}`,
            instanceUrl: state.defaultusername.instanceUrl,
          },
        }
      )
      return response
    } catch (error) {
      console.error(error)
    }
  },
  sendActiveEditor({ state }){
    this.$axios.post(`${process.env.SALESFORCE_API_ENDPOINT}/vscode/activeEditor`, 
      {
        editorName: Object.values(state.editors).find(editor => editor.active).name
      }
    )
  },
}
