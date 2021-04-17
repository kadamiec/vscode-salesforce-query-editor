export default {
  fetchSObjects({ commit, state }, { apiVersion, username }) {
    return this.$axios
      .get(
        `${process.env.LOCALHOST_API}/salesforce/${
          apiVersion || process.env.SALESFORCE_API_VERSION
        }/sobjects`,
        {
          headers: {
            Authorization: `Bearer ${state.environments[username].accessToken}`,
            instanceUrl: state.environments[username].instanceUrl,
          },
        }
      )
      .then((response) => {
        commit('setSObjects', { sobjects: response.data.sobjects, username })
      })
  },
  fetchSObjectFields(
    { commit, state, dispatch },
    { sobjectName, username, apiVersion }
  ) {
    const sobjectNameLowerCase = sobjectName.toLowerCase()
    if (
      !state.environments[username].sobjectsRequests[sobjectNameLowerCase] ||
      state.environments[username].sobjectsRequests[sobjectNameLowerCase]
        .status !== 'success'
    ) {
      const response = this.$axios.get(
        `${process.env.LOCALHOST_API}/salesforce/${
          apiVersion || process.env.SALESFORCE_API_VERSION
        }/sobjects/${sobjectNameLowerCase}`,
        {
          headers: {
            Authorization: `Bearer ${state.environments[username].accessToken}`,
            instanceUrl: state.environments[username].instanceUrl,
          },
        }
      )

      response.then((response) => {
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
      })

      return response
    }
  },
  fetchSObjectsFields({ commit, state }, { fields, apiVersion, username }) {
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
      const responses = this.$axios.post(
        `${process.env.LOCALHOST_API}/salesforce/${
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

      responses.then((responses) => {
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
      })

      return responses
    }
  },
  fetchRecords(
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
        }/query?q=${encodeURIComponent(soql)}`,
      },
    ]

    const responses = this.$axios.post(
      `${process.env.LOCALHOST_API}/salesforce/${
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

    responses.then((responses) => {
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
    })

    return responses
  },
  fetchSOQLPlan({ state }, { soql, apiVersion, username }) {
    return this.$axios.post(
      `${process.env.LOCALHOST_API}/salesforce/${
        apiVersion || process.env.SALESFORCE_API_VERSION
      }/query?explain=true`,
      {
        soql,
      },
      {
        headers: {
          Authorization: `Bearer ${state.environments[username].accessToken}`,
          instanceUrl: state.environments[username].instanceUrl,
        },
      }
    )
  },
  updateRecords({ state }, { changes, apiVersion, username }) {
    return this.$axios.patch(
      `${process.env.LOCALHOST_API}/salesforce/${
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
      `${process.env.LOCALHOST_API}/salesforce/${
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
  fetchEnvironments({ state, commit }){
    return this.$axios.get(`${process.env.LOCALHOST_API}/sfdx/orgs`)
    .then((response) => {
      commit('setEnvironments', response.data.result)
    })
  },
  fetchSFDXData({ state, commit, dispatch }) {
    return Promise.all([
      this.$axios.get(
        `${process.env.LOCALHOST_API}/sfdx/config/apiVersion`
      ),
      this.$axios.get(`${process.env.LOCALHOST_API}/sfdx/orgs`),
      this.$axios.get(`${process.env.LOCALHOST_API}/sfdx/defaultusername`),
    ]).then((responses) => {
      const apiVersionResponse = responses[0]
      const environmentsResponse = responses[1]
      const defaultUsernameResponse = responses[2]

      if (
        apiVersionResponse.data.result[0] &&
        apiVersionResponse.data.result[0].value
      ) {
        commit('setApiVersion', apiVersionResponse.data.result[0].value)
      }

      commit('setEnvironments', environmentsResponse.data.result)
      commit('setEnvironmentDetails', defaultUsernameResponse.data.result)

      return dispatch('fetchSObjects', {
        apiVersion: state.apiVersion,
        username: defaultUsernameResponse.data.result.username,
      }).then(() => {
        return state.environments[defaultUsernameResponse.data.result.username]
      })
    })
  },
  fetchEnvironmentDetails({ state, dispatch, commit }, { username }) {
    return this.$axios
      .get(`${process.env.LOCALHOST_API}/sfdx/orgs/${username}`)
      .then((response) => {
        commit('setEnvironmentDetails', response.data.result)
      })
      .then(() => {
        return dispatch('fetchSObjects', {
          apiVersion: state.apiVersion,
          username,
        })
      })
  },
  async cancelRequest({ state }) {
    try {
      const response = await this.$axios.get(
        `${process.env.LOCALHOST_API}/salesforce/cancel`,
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
  sendActiveEditor({ state }) {
    this.$axios.post(`${process.env.LOCALHOST_API}/vscode/activeEditor`, {
      editorName: Object.values(state.editors).find((editor) => editor.active)
        .name,
    })
  },
  fetchEditingSoql() {
    return this.$axios.get(`${process.env.LOCALHOST_API}/vscode/editor`)
  },
}
