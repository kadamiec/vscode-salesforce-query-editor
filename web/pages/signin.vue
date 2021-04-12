<template>
  <div class="d-flex flex-column vh-100">
    <div class="my-auto">
      <logo class="mx-auto mb-3"></logo>
      <form class="mx-auto" style="width: 300px">
        <div class="form-group control-label mt-2">
          <label for="email" class="form-label">E-mail</label>
          <input
            id="email"
            v-model="$v.user.email.$model"
            class="form-control"
            type="text"
            placeholder="Enter your email"
            @keyup.enter="onClickSignIn"
          />
          <template v-if="$v.user.email.$error">
            <div class="error form-text">The informed e-mail is wrong.</div>
          </template>
        </div>

        <div class="form-group control-label mt-2 mb-2">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="$v.user.password.$model"
            class="form-control"
            type="password"
            placeholder="Enter your password"
            @keyup.enter="onClickSignIn"
          />
          <template v-if="$v.user.password.$error">
            <div class="error form-text">Password is required</div>
          </template>
        </div>

        <div class="d-flex">
          <label class="form-check-label custom-checkbox-container">
            Keep me Signed in
            <input
              v-model="keepLoggedIn"
              class="form-check-input"
              type="checkbox"
            />
            <span class="checkmark" />
          </label>
          <div class="d-flex ml-auto my-auto">
            <NuxtLink to="/forgot-password">Forgot Password</NuxtLink>
          </div>
        </div>

        <button
          id="signin"
          type="reset"
          variant="primary"
          class="vscode-button mt-3 btn-block"
          :disabled="isLoggingIn"
          @click="onClickSignIn"
        >
          <div class="d-flex justify-content-center">
            <i v-if="isLoggingIn" class="fa fa-circle-o-notch fa-spin" />
            <p v-else>Sign In</p>
          </div>
        </button>

        <button
          id="signup"
          type="reset"
          variant="primary"
          class="vscode-button btn-block"
          :disabled="isLoggingIn"
          @click.prevent="onClickSignUp"
        >
          Sign Up
        </button>

        <div v-if="error" class="error text-center">
          <div>{{ error }}</div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import { mapState, mapActions } from 'vuex'
import { MD5 } from 'object-hash'
import showToastMessage from '@/mixins/show-toast-message'
import Logo from '@/components/logo'

export default {
  components: {
    Logo,
  },
  mixins: [showToastMessage],
  data: () => {
    return {
      user: {
        email: null,
        password: null,
      },
      error: null,
      isLoggingIn: false,
      keepLoggedIn: true,
    }
  },
  validations: {
    user: {
      email: {
        required,
        email,
      },
      password: {
        required,
      },
    },
  },
  computed: {
    ...mapState({
      isLocalServerRunning: (state) => state.user.isLocalServerRunning,
    }),
  },
  methods: {
    ...mapActions({
      login: 'user/login',
      fetchKeygenUser: 'user/fetchKeygenUser',
    }),
    onClickSignIn() {
      this.error = null
      this.$nextTick(() => (this.isLoggingIn = true))
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$nextTick(() => (this.isLoggingIn = false))
      } else {
        const password = MD5(this.user.password)
        this.login({
          email: this.user.email,
          password,
        })
          .then(() => {
            if (this.isLocalServerRunning && this.keepLoggedIn) {
              this.$axios
                .post(
                  `${process.env.SALESFORCE_SERVER}/vscode/login`,
                  {
                    login: {
                      email: this.user.email,
                      password,
                    },
                  },
                  {
                    headers: {
                      'Content-Type': 'application/vnd.api+json',
                      Accept: 'application/vnd.api+json',
                    },
                  }
                )
                .catch(() =>
                  this.showToastMessage(
                    'Could not save your User credentials on the storage'
                  )
                )
            }

            this.fetchKeygenUser()
              .then(() => {
                this.$router.push({ name: 'editor' })
              })
              .catch(
                () => (this.error = 'Could not fetch your User information')
              )
              .finally(() => this.$nextTick(() => (this.isLoggingIn = false)))
          })
          .catch((error) => {
            if (error.response.data.error) {
              this.error = error.response.data.error
            } else {
              this.error = 'Could not Login'
            }
            this.$nextTick(() => (this.isLoggingIn = false))
          })
      }
    },
    onClickSignUp() {
      this.$router.push({ name: 'signup' })
    },
  },
}
</script>

<style scoped>
/deep/ a {
  color: var(--vscode-textLink-foreground) !important;
  cursor: pointer;
}

button {
  height: 30px;
}
</style>
