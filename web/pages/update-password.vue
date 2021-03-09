<template>
  <div class="d-flex flex-column vh-100">
    <form class="m-auto" style="width: 400px">
      <div class="form-group control-label mt-2">
        <label for="password" class="form-label">Old Password</label>
        <input
          id="oldPassword"
          v-model="$v.user.oldPassword.$model"
          class="form-control"
          type="password"
          placeholder="Enter your old password"
          @keyup.enter="onClickChangePassword"
        />
        <div class="form-text" :class="{ error: $v.user.oldPassword.$error }">
          Password must have a minimum of eight characters, at least one letter,
          one number and one special character.
        </div>
      </div>

      <div class="form-group control-label mt-2">
        <label for="newPassword" class="form-label">New Password</label>
        <input
          id="newPassword"
          v-model="$v.user.newPassword.$model"
          class="form-control"
          type="password"
          placeholder="Enter a new password"
          @keyup.enter="onClickChangePassword"
        />
        <div class="form-text" :class="{ error: $v.user.newPassword.$error }">
          Password must have a minimum of eight characters, at least one letter,
          one number and one special character.
        </div>
      </div>

      <button
        id="signin"
        type="reset"
        variant="primary"
        class="vscode-button btn btn-block"
        :disabled="isChangingPassword"
        @click.prevent="onClickChangePassword"
      >
        <i v-if="isChangingPassword" class="fa fa-circle-o-notch fa-spin" />
        <p v-else>Change Password</p>
      </button>

      <button
        id="signin"
        type="reset"
        variant="primary"
        class="vscode-button btn btn-block"
        @click.prevent="onClickCancel"
      >
        Cancel
      </button>

      <div v-if="error" class="error text-center">
        <div>{{ error }}</div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import passwordValidator from '@/validators/password'
import showToastMessage from '@/mixins/show-toast-message'
import { MD5 } from 'object-hash'

export default {
  mixins: [showToastMessage],
  data: () => {
    return {
      user: {
        oldPassword: null,
        newPassword: null,
      },
      error: null,
      isChangingPassword: false,
    }
  },
  validations: {
    user: {
      oldPassword: {
        required,
        passwordValidator,
      },
      newPassword: {
        required,
        passwordValidator,
      },
    },
  },
  computed: {
    ...mapState({
      auth: (state) => state.user.auth,
    }),
  },
  methods: {
    onClickChangePassword() {
      this.isChangingPassword = true
      this.$axios
        .post(
          `https://api.keygen.sh/v1/accounts/${process.env.KEYGEN_ACCOUNT_ID}/users/${this.auth.userId}/actions/update-password`,
          {
            meta: {
              oldPassword: MD5(this.user.oldPassword),
              newPassword: MD5(this.user.newPassword),
            },
          },
          {
            headers: {
              'Content-Type': 'application/vnd.api+json',
              Accept: 'application/vnd.api+json',
              Authorization: `Bearer ${this.auth.token}`,
            },
          }
        )
        .then(() => this.$router.push({ name: 'account' }))
        .catch(() => this.showToastMessage('Could not update your password'))
        .finally(() => (this.isChangingPassword = false))
    },
    onClickCancel() {
      this.$router.push({ name: 'account' })
    },
  },
}
</script>

<style></style>
