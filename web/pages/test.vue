<template>
  <div>
    <loading v-if="!isDataReady" />
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
          <editor
            :name="editor.name"
            :editing-s-o-q-l="editingSOQL"
            class="pt-2 px-2"
          ></editor>
        </tab>
      </tabs>
      <editor
        v-else
        name="editor-0"
        :editing-s-o-q-l="editingSOQL"
        class="p-2"
      ></editor>
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
  layout: 'loggedin',
  middleware: ['auth', 'validate-keygen-license', 'menu'],
  data: () => {
    return {
      editingSOQL: null,
    }
  },
  computed: {
    ...mapState({
      configuration: (state) => state.user.configuration,
      editors: (state) => state.salesforce.editors,
      environments: (state) => state.salesforce.environments,
      defaultusername: (state) => state.salesforce.defaultusername,
    }),
    ...mapGetters({
      isLicenseValid: 'user/isLicenseValid',
      getActiveEditor: 'salesforce/getActiveEditor',
    }),
    activeEditor() {
      return this.getActiveEditor()
    },
    isDataReady() {
      return this.editors && !this.editors[this.activeEditor.name].loading
    },
  },
  mounted() {
    this.fetchEditingSoql().then((response) => {
      this.editingSOQL = response.data
    })
    this.fetchConfiguration()
    if (!this.isDataReady) {
      this.fetchSfdxData().catch(() => {
        return this.$nuxt.error({ message: 'Could not fetch sfdx data' })
      })
    }
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
      fetchSfdxData: 'salesforce/fetchSfdxData',
      sendActiveEditor: 'salesforce/sendActiveEditor',
      fetchConfiguration: 'user/fetchConfiguration',
      fetchEditingSoql: 'salesforce/fetchEditingSoql',
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
