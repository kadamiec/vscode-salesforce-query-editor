import apiVersions from '~/assets/api-versions.json'

export default () => ({
  editors: {
    'editor-0': {
      name: 'editor-0',
      label: 'Editor',
      active: true,
      username: null,
      loading: true,
    },
  },
  queries: [],
  defaultusername: {},
  editingSOQL: {},
  environments: {},
  apiVersion: 'v50.0',
  apiVersions,
})
