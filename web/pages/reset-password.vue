<template>
  <div class="d-flex flex-column vh-100">
    <form class="m-auto" style="width: 400px">

      <div class="form-group control-label mt-2">
        <label for="password" class="form-label">New Password</label>
        <input
          id="password"
          v-model="$v.user.password.$model"
          class="form-control"
          type="password"
          placeholder="Enter your password"
        />
        <div class="form-text" :class="{ error: $v.user.password.$error }">
            Password must have a minimum of eight characters, at least one letter,
            one number and one special character.
        </div>
      </div>

      <div class="form-group control-label mt-2">
        <label for="passwordConfirmation" class="form-label">Confirm Password</label>
        <input
          id="passwordConfirmation"
          v-model="$v.user.passwordConfirmation.$model"
          class="form-control"
          type="password"
          placeholder="Enter your Password again"
        />
        <template v-if="$v.user.passwordConfirmation.$error">
            <div class="error form-text">Passwords do not match.</div>
        </template>
      </div>

      <button
        id="signin"
        type="reset"
        variant="primary"
        class="vscode-button btn mt-4 btn-block"
        :disabled="isChangingPassword"
        @click.prevent="onClickChangePassword"
      >
        <i v-if="isChangingPassword" class="fa fa-circle-o-notch fa-spin" />
        <p v-else>Change Password</p>
      </button>

      <div v-if="error" class="error text-center">
        <div>{{ error }}</div>
      </div>
    </form>
  </div>
</template>

<script>
import { required, sameAs } from 'vuelidate/lib/validators'
import passwordValidator from '@/validators/password'
import showToastMessage from '@/mixins/show-toast-message'
import { MD5 } from 'object-hash'

export default {
    mixins: [showToastMessage],
    data: () => {
        return {
        user: {
            password: '07021994aA@',
            passwordConfirmation: '07021994aA@'
        },
        error: null,
        isChangingPassword: false,
        }
    },
    validations: {
        user: {
            password: {
                required,
                passwordValidator
            },
            passwordConfirmation: {
                sameAs: sameAs('password')
            }
        },
    },
    methods: {
        onClickChangePassword(){
            const queryParams = new URLSearchParams(atob(this.$route.query.code));

            this.isChangingPassword = true;
            this.$axios.post(`https://api.keygen.sh/v1/accounts/${process.env.KEYGEN_ACCOUNT_ID}/users/${queryParams.get("userId")}/actions/reset-password`,
                {
                    "meta": {
                        "passwordResetToken": queryParams.get("passwordResetToken"),
                        "newPassword": MD5(this.user.password)
                    }
                },
                {
                    headers: {
                        "Content-Type": "application/vnd.api+json",
                        "Accept": "application/vnd.api+json"
                    }
                }
            ).then(() => this.$router.push({name: 'signin'}))
            .catch(() => this.showToastMessage('Could not change your password'))
            .finally(() => this.isChangingPassword = false)
        }
    },
}
</script>

<style></style>
