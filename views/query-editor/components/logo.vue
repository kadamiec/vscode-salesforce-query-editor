<template>
  <div class="logo d-flex" @click="onClickLogo">
    <img src="~/assets/images/vscode_logo_42x42.png" />
    <div class="logo-title my-auto">Salesforce Query Editor</div>
  </div>
</template>

<script>
export default {
  methods: {
    onClickLogo() {
      window.open(
        'https://marketplace.visualstudio.com/items?itemName=allanoricil.salesforce-soql-editor',
        '__blank'
      )
    },
  },
}
</script>

<style scoped>
.logo {
  width: 320px;
  cursor: pointer;
}
.logo-title {
  width: 100%;
  font-size: 23px;
  padding-left: 10px;
}
</style>
