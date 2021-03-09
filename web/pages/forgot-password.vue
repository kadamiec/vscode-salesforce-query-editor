<template>
  <div class="d-flex flex-column vh-100">
    <form class="m-auto" style="width: 300px">
      <div class="form-group control-label mt-2">
        <label for="email" class="form-label">E-mail</label>
        <input
          id="email"
          v-model="$v.user.email.$model"
          class="form-control"
          type="text"
          placeholder="Enter your email"
          @keyup.enter="onClickResetPassword"
        />
        <template v-if="$v.user.email.$error">
          <div class="error form-text">The informed e-mail is wrong.</div>
        </template>
      </div>

      <button
        id="signup"
        type="reset"
        variant="primary"
        class="vscode-button btn btn-block"
        :disabled="isResetingPassword"
        @click.prevent="onClickResetPassword"
      >
        Reset Password
        <i v-if="isResetingPassword" class="fa fa-circle-o-notch fa-spin"></i>
      </button>

      <div v-if="error" class="error text-center">
        <div>{{ error }}</div>
      </div>
    </form>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'
import showToastMessage from '@/mixins/show-toast-message'

export default {
  mixins: [showToastMessage],
  data: () => {
    return {
      user: {
        email: null,
      },
      error: null,
      isResetingPassword: false,
    }
  },
  validations: {
    user: {
      email: {
        required,
        email,
      },
    },
  },
  methods: {
    ...mapActions({}),
    onClickResetPassword() {
      this.isResetingPassword = true
      this.$axios
        .post(
          'https://api.keygen.sh/v1/accounts/78edb4be-f034-4809-9ea9-b29b0dff113e/passwords',
          {
            meta: {
              email: this.user.email,
              deliver: false,
            },
          },
          {
            headers: {
              'Content-Type': 'application/vnd.api+json',
              Accept: 'application/vnd.api+json',
            },
          }
        )
        .then(() => this.$router.push({ name: 'success-password-reset' }))
        .catch(() => this.showToastMessage('Could not request new password'))
        .finally(() => (this.isResetingPassword = false))
    },
  },
}
</script>

<style></style>
