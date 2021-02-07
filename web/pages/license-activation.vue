<template>
  <div class="d-flex vh-100 vw-100">
    <template v-if="license && license.status === 'valid'">
      <div class="d-flex flex-column m-auto">
        <i class="fas fa-10x mx-auto fa-check-circle"></i>
        <div style="font-size: 50px">License was Successfully Activated</div>
        <redirect-button redirect-to="/"></redirect-button>
      </div>
    </template>
    <div v-else-if="license && license.status === 'invalid'">
      License is Invalid
    </div>
    <div v-else class="d-flex flex-column m-auto">
      <label for="key" class="text-center">Activate your Key</label>
      <input id="key" v-model="$v.key.$model" />
      <template v-if="$v.key.$error">
        <div class="error form-text">Key is required.</div>
      </template>
      <button
        class="vscode-button btn mt-2"
        :disabled="$v.key.$invalid"
        @click="onClickActivate()"
      >
        Activate
      </button>
      <div v-if="errors" class="error text-center">
        <div v-for="(error, errorIndex) in errors" :key="errorIndex">
          <div v-if="error.showCode">Code: {{ error.code }}</div>
          <div>{{ error.message }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import redirectButton from '../components/redirect-button.vue'

export default {
  components: {
    redirectButton,
  },
  data: () => {
    return {
      key: null,
      errors: [],
    }
  },
  // @ts-ignore
  validations: {
    key: {
      required,
    },
  },
  beforeMount() {
    this.fetchMachineFingerprint()
  },
  computed: {
    ...mapState({
      auth: (state) => state.user.auth,
      license: (state) => state.user.license,
      fingerprint: (state) => state.user.fingerprint,
    }),
  },
  methods: {
    ...mapActions({
      validateLicense: 'user/validateLicense',
      fetchMachineFingerprint: 'user/fetchMachineFingerprint',
      activateMachine: 'user/activateMachine',
      saveLicense: 'user/saveLicense'
    }),
    onClickActivate() {
      this.errors = []
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log('Form is Invalid.')
      } else {
        this.activateMachine({ key: this.key })
        .then(() => {
          this.validateLicense({ key: this.key })
          .then(() => {
            this.saveLicense({ key: this.key })
          })
        })
        .catch((error) => {
          this.errors.push({ message: error.response.data.error });
        })
      }
    },
  },
}
</script>

<style scoped>
label {
  font-size: 20px !important;
}

input {
  height: 30px !important;
  width: 500px !important;
}

button {
  height: 30px !important;
}

.error {
  color: red;
}
</style>
