<template>
  <div>
    <loading v-if="editors && editors['editor-0'].loading" />
    <template v-else>
      <tabs
        v-if="isLicenseValid()"
        :value="activeEditor.name"
        @newTab="onClickNewTab"
        @removeTab="onRemoveTab"
        @activate="onClickTab"
      >
        <tab
          v-for="editor in editors"
          :key="editor.name"
          :name="editor.name"
          :label="editor.label"
          :is-active="activeEditor.name === editor.name"
        >
          <editor :name="editor.name" :editing-s-o-q-l="editingSOQL"></editor>
        </tab>
      </tabs>
      <editor v-else :editing-s-o-q-l="editingSOQL"></editor>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import Editor from '@/components/editor.vue'
import Tabs from '@/components/tabs'
import Tab from '@/components/tab'
import Loading from '@/components/loading'
import soqlEditor from '~/assets/js/utils/soqlEditor/index'

soqlEditor.activate()

export default {
  components: {
    Editor,
    Tabs,
    Tab,
    Loading,
  },
  middleware: ['validate-keygen-license'],
  data: () => {
    return {
      editingSOQL: null,
    }
  },
  computed: {
    ...mapState({
      configuration: (state) => state.user.configuration,
      editors: (state) => state.salesforce.editors,
    }),
    ...mapGetters({
      isLicenseValid: 'user/isLicenseValid',
      getActiveEditor: 'salesforce/getActiveEditor',
    }),
    activeEditor() {
      return this.getActiveEditor()
    },
  },
  beforeMount() {
    this.$axios
      .get(`${process.env.SALESFORCE_API_ENDPOINT}/vscode/editor`)
      .then((response) => {
        console.log('editing soql')
        console.log(response.data)
        this.editingSOQL = response.data
      })
      .catch((error) => {
        console.error(error)
      })
  },
  sockets: {
    connect() {
      console.log('connected')
    },
    defaultusername(data) {
      console.log(data)
    },
    editingsoql(editingSOQL) {
      console.log(editingSOQL)
      if (editingSOQL?.soql) this.editingSOQL = editingSOQL
    },
  },
  methods: {
    ...mapActions({
      sendActiveEditor: 'salesforce/sendActiveEditor',
    }),
    ...mapMutations({
      addEditor: 'salesforce/addEditor',
      deleteEditor: 'salesforce/deleteEditor',
      setActiveEditor: 'salesforce/setActiveEditor',
    }),
    onClickNewTab({ label, name }) {
      this.addEditor({ editorName: name, editorLabel: label })
      this.sendActiveEditor()
    },
    onClickTab(editorName) {
      this.setActiveEditor({ editorName })
    },
    onRemoveTab({ name, index }) {
      if (this.activeEditor.name === name) {
        const editorKeys = Object.keys(this.editors)
        let editorName
        if (index === editorKeys.length - 1) {
          editorName = editorKeys[index - 1]
        } else {
          editorName = editorKeys[index + 1]
        }
        this.setActiveEditor({ editorName })
      }
      this.deleteEditor({ editorName: name })
    },
  },
}
</script>

<style scopped>
.tab-delete-button {
  background-color: transparent;
  color: var(--vscode-button-foreground) !important;
}

.tab-delete-button:hover {
  color: var(--vscode-button-foreground) !important;
}

.google-ads-container {
  width: 150px;
  height: 100vh;
}
</style>
