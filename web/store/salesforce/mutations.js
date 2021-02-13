import Vue from 'vue'
import apiVersions from '~/assets/api-versions.json'

export default {
  setSObject(state, { sobject, username }) {
    Vue.set(
      state.environments[username].sobjectsWithDetails,
      sobject.name.toLowerCase(),
      sobject
    )
  },
  setSObjects(state, { sobjects, username }) {
    state.environments[username].sobjects = {}
    sobjects.forEach((sobject) => {
      Vue.set(
        state.environments[username].sobjects,
        sobject.name.toLowerCase(),
        sobject
      )
    })
    state.environments = {...state.environments}
  },
  clearSObjectsDetails(state) {
    state.sobjectsWithDetails = {}
  },
  setApiVersion(state, apiVersion) {
    state.apiVersion = 'v' + apiVersion
  },
  setSObjectRequests(state, { sobjectName, status, username }) {
    state.environments[username].sobjectsRequests[sobjectName] = {
      status,
    }
  },
  setEnvironments(state, environments) {
    const nonScratchOrgs = environments.nonScratchOrgs || []
    const scratchOrgs = environments.scratchOrgs || []

    let envs = {};
    nonScratchOrgs.forEach((env) => {
      envs = {
        ...envs,
        [env.username]: {
          ...env,
          isScratchOrg: false,
          sobjects: {},
          sobjectsWithDetails: {},
          sobjectsRequests: {},
        },
      }
    })

    scratchOrgs.forEach((env) => {
      envs = {
        ...envs,
        [env.username]: {
          ...env,
          isScratchOrg: true,
          sobjects: {},
          sobjectsWithDetails: {},
          sobjectsRequests: {},
        },
      }
    })

    state.environments = envs;
  },
  setEnvironmentDetails(state, environmentDetails) {
    state.environments[environmentDetails.username] = {
      ...state.environments[environmentDetails.username],
      ...environmentDetails,
      sobjects: {},
      sobjectsWithDetails: {},
      sobjectsRequests: {},
    }
  },
  clearEnvironment(state, username) {
    state.environments[username].sobjects = {}
    state.environments[username].sobjectsWithDetails = {}
    state.environments[username].sobjectsRequests = {}
  },
  setSelectedUsername(state, { editorName, username }) {
    state.editors[editorName].username = username
  },
  setEditorLoadingState(state, { editorName, isLoading }) {
    state.editors[editorName].loading = isLoading
  },
  addEditor(state, { editorName, editorLabel }) {
    for (const [_, editor] of Object.entries(state.editors)) {
      editor.active = false
    }
    Vue.set(state.editors, editorName, {
      active: true,
      name: editorName,
      label: editorLabel,
      username: state.editors[Object.keys(state.editors)[0]].username,
      loading: false,
    })
  },
  setActiveEditor(state, { editorName }) {
    for (const [_, editor] of Object.entries(state.editors)) {
      editor.active = false
    }
    state.editors[editorName].active = true
    Vue.set(state.editors, editorName, state.editors[editorName])
  },
  deleteEditor(state, { editorName }) {
    Vue.delete(state.editors, editorName)
  },
  saveQueryToHistory(state, { query, username }) {
    if (!state.environments[username].history)
      Vue.set(state.environments[username], history, [])
    state.environments[username].history.push(query)
  },
  saveQuery(state, { query }) {
    state.queries.push(query)
  },
  reset: (state) => {
    state.editors = {
      'editor-0': {
        name: 'editor-0',
        label: 'Editor',
        active: true,
        username: null,
        loading: true,
      },
    }
    state.queries = []
    state.defaultusername = {}
    state.editingSOQL = {}
    state.environments = {}
    state.apiVersion = 'v50.0'
    state.apiVersions = apiVersions
  },
}
