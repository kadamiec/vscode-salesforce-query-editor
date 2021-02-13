<template>
  <div class="d-flex vh-100 vw-100">
    <template v-if="license && license.status === 'valid'">
      <div class="d-flex flex-column m-auto">
        <i class="fas fa-10x mx-auto fa-check-circle"></i>
        <div style="font-size: 50px">License was Successfully Activated</div>
        <redirect-button
          page-name="editor"
          page-label="Editor"
        ></redirect-button>
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
        :disabled="$v.key.$invalid || isActivating"
        @click="onClickActivate()"
      >
        Activate
        <i v-if="isActivating" class="fa fa-circle-o-notch fa-spin" />
      </button>
      <div v-if="error" class="error text-center">{{ error }}</div>
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
      error: null,
      isActivating: false,
    }
  },
  validations: {
    key: {
      required,
    },
  },
  computed: {
    ...mapState({
      auth: (state) => state.user.auth,
      license: (state) => state.user.license,
    }),
  },
  methods: {
    ...mapActions({
      validateLicense: 'user/validateLicense',
      activateMachineUsingKey: 'user/activateMachineUsingKey',
      saveLicense: 'user/saveLicense',
    }),
    onClickActivate() {
      this.error = null
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log('Form is Invalid.')
      } else {
        this.isActivating = true
        this.activateMachineUsingKey({ key: this.key })
          .then(() => {
            this.$router.push({ name: 'account' })
          })
          .catch((error) => {
            this.error = error.response.data.error
          })
          .finally(() => {
            this.isActivating = false
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
