<template>
  <div v-if="licenses" class="d-flex flex-column vh-100 vw-100">
    <div class="d-flex justify-content-between mx-auto mt-5">
      <div class="d-flex justify-content-between" style="width: 450px">
        <div class="d-flex flex-column">
          <div style="font-size: 18px; weight: bold">Owner</div>
          <div>allanoricilcos@outlook.com</div>
        </div>
        <div class="my-auto">
          <button class="vscode-button btn" @click="onClickDeleteAll">Delete All</button>
          <button class="vscode-button btn" @click="onClickDeactivateAll">Deactivate All</button>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column mt-4 mx-auto">
      <div
        v-for="license in licenses"
        :key="license.key"
        class="license-card mb-2"
      >
        <div class="d-flex justify-content-between">
          <div class="w-100">
            <p>
              Key: <strong>{{ license.key }}</strong>
            </p>
            <p>
              Expiry:
              {{ format(license.expiry) }}
            </p>
            <p>Activations: {{ license.uses }}</p>
            <p>Max Activations: {{ license.maxUses }}</p>
          </div>
          <div class="my-auto ml-5 mr-2">
            <button
              v-if="license.uses === license.maxUses"
              class="vscode-button btn"
              @click="onClickDeactivateLicense(license.key)"
            >
              Deactive
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { DateTime } from 'luxon'

export default {
  middleware: 'auth',
  computed: {
    ...mapGetters({
      getLicenses: 'user/getLicenses',
      getUserEmail: 'user/getUserEmail',
    }),
    licenses() {
      return this.getLicenses()
    },
    owner() {
      return this.getUserEmail()
    },
  },
  mounted() {
    this.fetchLicenses()
  },
  methods: {
    ...mapActions({
      fetchLicenses: 'user/fetchLicenses',
    }),
    format(date) {
        return DateTime.fromISO(date).toFormat('dd LLL yyyy')
    },
    onClickDeleteAll(){

    },
    onClickDeactivateLicense(key){

    },
    onClickDeactivateAll(){

    }
  },
}
</script>

<style scoped>
.license-card {
  padding: 5px 10px 0px 0px;
  width: 450px;
}
</style>
