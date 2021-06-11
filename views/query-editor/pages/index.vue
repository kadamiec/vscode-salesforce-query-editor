<template>
  <div>
    <template v-if="isLocalServerRunning">
      <tabs
        v-if="displayTabs"
        :value="activeEditor"
        :is-add-tab-enabled="isAddTabEnabled"
        @newTab="onClickNewTab"
        @removeTab="onRemoveTab"
        @activate="onClickTab"
      >
        <tab
          v-for="editor in editors"
          :key="editor.name"
          :name="editor.name"
          :label="editor.label"
          :is-active="activeEditor === editor.name"
        >
          <editor
            :name="editor.name"
            :defaultusername="defaultusername"
            :is-active="activeEditor === editor.name"
            :is-loading-environments="isLoadingEnvironments"
            @reloadEnvironments="onReloadEnvironments"
          ></editor>
        </tab>
      </tabs>
      <editor
        v-else
        name="editor-0"
        :defaultusername="defaultusername"
        :is-active="true"
        :is-loading-environments="isLoadingEnvironments"
        class="vh-100"
        @reloadEnvironments="onReloadEnvironments"
      ></editor>
    </template>
    <div v-else class="d-flex vh-100">
      <h3 class="m-auto">
        Open VS Code, wait until the extension is Activated, and then refresh
        this Page.
      </h3>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import Editor from '@/components/editor.vue'
import Tabs from '@/components/tabs'
import Tab from '@/components/tab'
import isVscode from '~/mixins/is-vscode'

export default {
  components: {
    Editor,
    Tabs,
    Tab,
  },
  mixins: [isVscode],
  middleware: ['menu'],
  data: () => {
    return {
      defaultusername: {},
      activeEditor: 'editor-0',
      isAddTabEnabled: false,
      isLoadingEnvironments: true,
      editors: [
        {
          name: 'editor-0',
          label: 'Editor',
        },
      ],
    }
  },
  computed: {
    ...mapState({
      configuration: (state) => state.user.configuration,
      isLocalServerRunning: (state) => state.user.isLocalServerRunning,
    }),
    ...mapGetters({
      getEnvironment: 'salesforce/getEnvironment',
    }),
    displayTabs() {
      return this.configuration.displayTabs
    },
  },
  sockets: {
    defaultusername(defaultusername) {
      this.setEnvironmentDetails(defaultusername.result)
      this.defaultusername = this.getEnvironment(
        defaultusername.result.username
      )
    },
  },
  mounted() {
    if (this.isLocalServerRunning) {
      this.fetchConfiguration()
      this.fetchSFDXData().then((defaultusername) => {
        this.isAddTabEnabled = true
        this.isLoadingEnvironments = false
        this.defaultusername = defaultusername
      })
    }
  },
  methods: {
    ...mapActions({
      fetchSFDXData: 'salesforce/fetchSFDXData',
      fetchEnvironments: 'salesforce/fetchEnvironments',
      fetchConfiguration: 'user/fetchConfiguration',
      fetchSObjects: 'salesforce/fetchSObjects',
    }),
    ...mapMutations({
      setEnvironmentDetails: 'salesforce/setEnvironmentDetails',
    }),
    onClickNewTab({ label, name }) {
      this.editors.push({
        name,
        label,
      })
      this.activeEditor = name
    },
    onClickTab(editorName) {
      this.activeEditor = editorName
    },
    onRemoveTab({ name, index }) {
      if (this.activeEditor === name) {
        this.activeEditor =
          index === this.editors.length - 1
            ? this.editors[index - 1].name
            : this.editors[index + 1].name
      }
      this.editors.splice(index, 1)
    },
    onReloadEnvironments() {
      this.isLoadingEnvironments = true
      this.fetchSFDXData()
        .then((defaultusername) => {
          this.defaultusername = defaultusername
        })
        .finally(() => (this.isLoadingEnvironments = false))
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
</style>
