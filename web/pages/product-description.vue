<template>
  <div class="features-container d-flex flex-column mt-5">
    <div class="d-flex flex-column">
      <div class="container">
        <div class="row mb-5">
          <div class="col-2">
            <div class="d-flex"><h4 class="ml-auto">Window Mode</h4></div>
          </div>
          <div class="col-10">
            <img src="~/assets/images/window_mode.PNG" style="width: 90%" />
          </div>
        </div>
        <div class="row mb-5">
          <div class="col-2">
            <div class="d-flex"><h4 class="ml-auto">Desktop App (PWA)</h4></div>
          </div>
          <div class="col-10">
            <img src="~/assets/images/pwa_mode.PNG" style="width: 90%" />
          </div>
        </div>
        <div class="row mb-5">
          <div class="col-2">
            <div class="d-flex">
              <h4 class="ml-auto">Work with Multiple Tabs</h4>
            </div>
          </div>
          <div class="col-10">
            <img src="~/assets/images/tabs.PNG" style="width: 90%" />
          </div>
        </div>
        <div class="row mb-5">
          <div class="col-2">
            <div class="d-flex">
              <h4 class="ml-auto">Quickly run a Query</h4>
            </div>
          </div>
          <div class="col-10">
            <img
              src="~/assets/images/demo_query_on_click.gif"
              style="width: 90%"
            />
          </div>
        </div>
        <div class="row mb-5">
          <div class="col-2">
            <div class="d-flex">
              <h4 class="ml-auto">Removes Buy Pro golden button and any other Propaganda</h4>
            </div>
          </div>
          <div class="col-10">
            <img
              src="~/assets/images/remove_golden_button.PNG"
              style="width: 90%"
            />
          </div>
        </div>
        <div class="row mb-5">
          <div class="col-2">
            <div class="d-flex">
              <h4 class="ml-auto">
                Quickly Add or Update Queries in your Apex Class
              </h4>
            </div>
          </div>
          <div class="col-10">
            <img
              src="~/assets/images/add_update_apex_demo.gif"
              style="width: 90%"
            />
          </div>
        </div>

        <div class="row mb-5">
          <div class="col-12">
            <button
              class="vscode-button btn w-100"
              @click="onClickBuyALicenseButton"
            >
              Buy License
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    onClickBuyALicenseButton() {
      this.$router.push({ name: 'subscription' })
    },
  },
}
</script>

<style scoped>
.features-container {
  overflow-y: auto !important;
}

h4 {
  text-align: right !important;
}

button {
  height: 50px;
  font-size: 18px;
}
</style>
