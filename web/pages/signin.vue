<template>
  <div class="d-flex flex-column vw-100 vh-100">
    <form class="m-auto" style="width: 300px">
      <div class="form-group required control-label mt-2">
        <label for="email" class="form-label">E-mail</label>
        <input
          id="email"
          v-model="$v.user.email.$model"
          class="form-control"
          type="text"
          placeholder="Enter your email"
        />
        <template v-if="$v.user.email.$error">
          <div class="error form-text">The informed e-mail is wrong.</div>
        </template>
      </div>

      <div class="form-group required control-label mt-2">
        <label for="password" class="form-label">Password</label>
        <input
          id="password"
          v-model="$v.user.password.$model"
          class="form-control"
          type="password"
          placeholder="Enter your password"
        />
      </div>

      <button
        type="reset"
        variant="primary"
        class="vscode-button btn mt-4 btn-block"
        @click.prevent="submit()"
      >
        Login
        <i v-if="isLoggingIn" class="fa fa-circle-o-notch fa-spin" />
      </button>

      <div v-if="errors" class="error text-center">
        <div v-for="error in errors" :key="error">
          <div v-if="error.showCode">Code: {{ error.code }}</div>
          <div>Error Message: {{ error.message }}</div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { required, email, helpers } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'

const passwordValidator = helpers.regex(
  'alpha',
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
)

export default {
  name: 'SignUp',
  data: () => {
    return {
      user: {
        email: null,
        password: null,
        passwordConfirmation: null,
      },
      errors: [],
      isLoggingIn: false,
    }
  },
  // @ts-ignore
  validations: {
    user: {
      email: {
        required,
        email,
      },
      password: {
        required,
        passwordValidator,
      },
    },
  },
  methods: {
    ...mapActions({
      login: 'user/login',
    }),
    submit() {
      this.errors = []
      this.isLoggingIn = true
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log('Error')
      } else {
        this.login({
          email: this.user.email,
          password: this.user.password,
        })
        .then(()=> {
          this.$router.push({ name: 'editor' })
        })
        .catch (() => {
          this.errors.push({
            message: 'Could not Login',
            code: null,
            showCode: false,
          })
        })
      }
    },
  },
}
</script>

<style scoped>
.form-group.required.control-label:before {
  color: red;
  content: '*';
  position: absolute;
  margin-left: -10px;
}

.error {
  color: red;
}
</style>
