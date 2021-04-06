<template>
  <div style="height: 386px">
    <monaco-editor
      ref="editor"
      :value="query"
      class="editor"
      language="soql"
      theme="custom-theme"
      :options="options"
      @change="onChangeQuery"
      @editorWillMount="onEditorWillMount"
      @editorDidMount="onEditorDidMount"
    />
  </div>
</template>

<script>
import MonacoEditor from '@allanoricil/vue-monaco'
import { debounce } from 'debounce'
import { mapState } from 'vuex'
import soqlTokensProvider from '~/assets/js/soql-tokens-provider';

export default {
  components: {
    MonacoEditor,
  },
  props: {
    value: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isLoadingData: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      monaco: null,
      query: '',
      options: {
        contextmenu: false,
        minimap: {
          enabled: false,
        },
        scrollbar: {
          verticalScrollbarSize: 5,
          horizontalScrollbarSize: 5,
        },
        lightbulb: {
          enabled: false,
        },
        quickSuggestions: false,
        snippetSuggestions: 'none',
        acceptSuggestionOnCommitCharacter: false,
        acceptSuggestionOnEnter: 'off',
        tabCompletion: 'off',
        wordBasedSuggestions: false,
        renderLineHighlight: 'none',
        mouseWheelZoom: true,
        renderValidationDecorations: 'off',
        disableLayerHinting: true,
        scrollBeyondLastLine: false,
        fontSize: '13px',
      },
    }
  },
  computed: {
    ...mapState({
      theme: (state) => state.user.theme,
    }),
    editor() {
      return this.$refs.editor.getEditor()
    },
  },
  watch: {
    value(newValue) {
      this.query = newValue
    },
    theme() {
      this.monaco?.editor?.defineTheme('custom-theme', this.theme)
      const model = this.editor?.getModel()
      const lines = model?.getLineCount()
      model?.forceTokenization(lines)
    },
    isActive(){
      this.setEditorLayout();
    },
    isLoadingData(){
      this.setEditorLayout();
    }
  },
  mounted() {
    this.query = this.value || ''
    window.addEventListener('resize', this.setEditorLayout)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setEditorLayout)
  },
  methods: {
    onEditorWillMount(monaco) {
      this.monaco = monaco
      monaco.languages.register({ id: 'soql' })
      monaco.languages.setMonarchTokensProvider('soql', soqlTokensProvider)
      monaco.editor.defineTheme('custom-theme', this.theme)
    },
    setEditorLayout(){
      setTimeout(() => {
        if(this.isActive && !this.isLoadingData) this.editor.layout();
      }, 100)
    },
    onEditorDidMount(editor) {
      editor.layout()
    },
    onChangeQuery: debounce(function (value) {
      this.$emit('input', value)
    }, 1000),
  },
}
</script>

<style scoped>
.editor {
  width: 100%;
  height: 100%;
  min-height: 200px;
  border: thin solid var(--vscode-inputOption-activeBackground);
}
</style>
