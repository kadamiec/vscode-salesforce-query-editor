import { convertArrayToObject } from '~/assets/js/utils/objectUtils.js'

export default {
  getSObjectByName: (state) => ({ sobjectName, username }) => {
    return state.environments[username].sobjects[sobjectName.toLowerCase()]
  },
  getQueryableSObjects: (state) => ({ username }) => {
    return Object.values(state.environments[username].sobjects)
      .filter((object) => {
        return object.queryable
      })
      .sort(function (a, b) {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      }).map((sobject) => {
        return { label: sobject.label, name: sobject.name }
      })
  },
  getSObjectFields: (state) => ({ sobjectName, username }) => {
    return sobjectName &&
      state.environments[username].sobjectsWithDetails[
        sobjectName.toLowerCase()
      ]
      ? [...state.environments[username].sobjectsWithDetails[
          sobjectName.toLowerCase()
        ].fields].sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        )
      : []
  },
  getSObjectChildRelationships: (state) => ({ sobjectName, username }) => {
    return sobjectName &&
      state.environments[username].sobjectsWithDetails[
        sobjectName.toLowerCase()
      ]
      ? [...state.environments[username].sobjectsWithDetails[
          sobjectName.toLowerCase()
        ].childRelationships]
          .filter(
            (childRelationship) =>
              childRelationship.relationshipName &&
              !childRelationship.deprecatedAndHidden
          )
          .sort((a, b) =>
            a.childSObject
              .toLowerCase()
              .localeCompare(b.childSObject.toLowerCase())
          )
      : []
  },
  getSObjectFieldsMappedByName: (state) => ({ sobjectName, username }) => {
    return sobjectName &&
      state.environments[username].sobjectsWithDetails[
        sobjectName.toLowerCase()
      ]
      ? convertArrayToObject(
          state.environments[username].sobjectsWithDetails[
            sobjectName.toLowerCase()
          ].fields,
          'name'
        )
      : {}
  },
  getConnectedEnvironments: (state) => () => {
    return Object.values(state.environments).filter(
      (environment) => environment.connectedStatus === 'Connected'
    )
  },
  getActiveEditor: (state) => () => {
    return Object.values(state.editors).find(editor => editor.active);
  },
  getActiveEditorUsername: (state) => () => {
    const activeEditor = Object.values(state.editors).find(editor => editor.active);
    if(activeEditor) return activeEditor.username;
    else return null;
  }
}
