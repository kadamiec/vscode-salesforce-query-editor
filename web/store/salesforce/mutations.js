import Vue from 'vue'

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
  },
  clearSObjectsDetails(state) {
    state.sobjectsWithDetails = {}
  },
  setDefaultusername(state, defaultusername) {
    state.defaultusername = defaultusername

    state.environments = {
      ...state.environments,
      [defaultusername.username]: {
        ...defaultusername,
        sobjects: {},
        sobjectsWithDetails: {},
        sobjectsRequests: {},
      },
    }
  },
  setApiVersion(state, apiVersion) {
    state.apiVersion = apiVersion
  },
  setSObjectRequests(state, { sobjectName, status, username }) {
    state.environments[username].sobjectsRequests[sobjectName] = {
      status,
    }
  },
  setEnvironments(state, environments) {
    state.environments = environments.reduce((previous, current) => {
      return {
        ...previous,
        [current.username]: {
          ...current,
          sobjects: {},
          sobjectsWithDetails: {},
          sobjectsRequests: {},
        },
      }
    }, [])
  },
  setEnvironmentDetails(state, environmentDetails) {
    state.environments[environmentDetails.username] = {
      ...state.environments[environmentDetails.username],
      ...environmentDetails,
    }
  },
  setSelectedUsername(state, { editorName, username }) {
    state.editors[editorName].username = username
  },
  setEditorLoadingState(state, { editorName, isLoading }) {
    state.editors[editorName].loading = isLoading
  },
  addEditor(state, { editorName, editorLabel }) {
    for (const [_, editor] of Object.entries(state.editors)) {
      editor.active = false;
    }
    Vue.set(state.editors, editorName, {
      active: true,
      name: editorName,
      label: editorLabel,
      username: state.editors[Object.keys(state.editors)[0]].username,
      loading: false,
    });
  },
  setActiveEditor(state, { editorName }) {
    for (const [_, editor] of Object.entries(state.editors)) {
      editor.active = false;
    }
    state.editors[editorName].active = true;
    Vue.set(state.editors, editorName, state.editors[editorName]);
  },
  deleteEditor(state, { editorName }) {
    Vue.delete(state.editors, editorName);
  },
  saveQueryToHistory(state, { query, username }){
    if(!state.environments[username].history) Vue.set(state.environments[username], history, []);
    state.environments[username].history.push(query);
  },
  saveQuery(state, { query }){
    state.queries.push(query);
  }
}
