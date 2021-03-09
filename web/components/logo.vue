<template>
  <div class="logo d-flex" @click="onClickLogo">
    <img
      src="https://drive.google.com/uc?id=1G--WE3tsAMBEJkg7zsJ9ktx8P-oJvd8W"
      width="13%"
    />
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
  font-size: 25px;
  padding-left: 10px;
}
</style>
