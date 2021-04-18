<template>
  <div class="d-flex flex-column">
    <div class="form-group control-label">
      <label for="firstame" class="form-label"
        ><span class="required-symbol">*</span>First Name</label
      >
      <input
        id="firstname"
        v-model="$v.user.firstname.$model"
        class="form-control"
        @input="onChange"
      />
      <template v-if="$v.user.firstname.$error">
        <div class="error form-text">First Name is required.</div>
      </template>
    </div>

    <div class="form-group control-label mt-2">
      <label for="lastname" class="form-label"
        ><span class="required-symbol">*</span>Last Name</label
      >
      <input
        id="lastname"
        v-model="$v.user.lastname.$model"
        class="form-control"
        @input="onChange"
      />
      <template v-if="$v.user.lastname.$error">
        <div class="error form-text">Last Name is required.</div>
      </template>
    </div>

    <div class="form-group control-label mt-2">
      <label for="email" class="form-label"
        ><span class="required-symbol">*</span>E-mail</label
      >
      <input
        id="email"
        v-model="$v.user.email.$model"
        class="form-control"
        type="text"
        @input="onChange"
      />
      <template v-if="$v.user.email.$error">
        <div class="error form-text">The informed e-mail is wrong.</div>
      </template>
    </div>

    <div class="form-group control-label mt-2">
      <label for="password" class="form-label"
        ><span class="required-symbol">*</span>Password</label
      >
      <input
        id="password"
        v-model="$v.user.password.$model"
        class="form-control"
        type="password"
        @input="onChange"
      />
      <div class="form-text" :class="{ error: $v.user.password.$error }">
        Password must have a minimum of eight characters, at least one letter,
        one number and one special character (@ \ ' $ ! % * # ? & ).
      </div>
    </div>

    <div class="form-group control-label mt-2">
      <label for="passwordConfirmation" class="form-label"
        ><span class="required-symbol">*</span>Confirm Password</label
      >
      <input
        id="passwordConfirmation"
        v-model="$v.user.passwordConfirmation.$model"
        class="form-control"
        type="password"
        @input="onChange"
      />
      <template v-if="$v.user.passwordConfirmation.$error">
        <div class="error form-text">Passwords do not match.</div>
      </template>
    </div>
  </div>
</template>

<script>
import { required, sameAs, email } from 'vuelidate/lib/validators'
import passwordValidator from '~/validators/password.js'

export default {
  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
  data: () => {
    return {
      user: {
        firstname: 'Allan',
        lastname: 'Oricil',
        email: 'allanoricil@outlook.com',
        password: '07021994aA@',
        passwordConfirmation: '07021994aA@',
      },
      complete: false,
      submited: false,
      mountCard: false,
      errors: [],
    }
  },
  mounted() {
    this.user = { ...this.value }
  },
  validations: {
    user: {
      firstname: {
        required,
      },
      lastname: {
        required,
      },
      email: {
        required,
        email,
      },
      password: {
        required,
        passwordValidator,
      },
      passwordConfirmation: {
        sameAs: sameAs('password'),
      },
    },
  },
  methods: {
    onChange() {
      this.$emit('input', this.user)
    },
  },
}
</script>

<style></style>
