<template>
  <codemirror
    :value="query"
    :options="cmOptions"
    heigth="100px"
    @ready="onCodeMirrorReady"
    @input="onCmCodeChange"
  />
</template>

<script>
import 'codemirror/mode/sql/sql.js'
import { codemirror } from 'vue-codemirror'

export default {
  components: {
    codemirror,
  },
  props: {
    value: {
      type: String,
      default: null,
    },
  },
  data: () => {
    return {
      query: null,
      cmOptions: {
        tabSize: 4,
        mode: 'text/x-mysql',
        theme: 'vscode-dark',
        lineNumbers: true,
        lineWrapping: true,
        line: true,
        height: 100,
      },
    }
  },
  watch:{
      value(newValue){
          this.query = newValue;
      }
  },
  mounted() {
    this.query = this.value
  },
  methods: {
    onCodeMirrorReady(cm) {
      cm.setSize(null, this.cmOptions.height)
    },
    onCmCodeChange(newCode) {
      this.$emit('input', newCode)
    },
  },
}
</script>

<style src="codemirror/lib/codemirror.css"></style>
<style scopped></style>
