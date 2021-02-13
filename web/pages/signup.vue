<template>
  <div class="d-flex vw-100 vh-100">
    <div class="d-flex flex-column m-auto" style="width: 350px">
      <sign-up-form ref="sign-up-form" v-model="user"></sign-up-form>

      <button
        variant="primary"
        class="vscode-button btn mt-3 btn-block"
        @click.prevent="submit()"
      >
        Sign Up
        <i v-if="submited" class="fa fa-circle-o-notch fa-spin" />
      </button>

      <div v-if="error" class="error text-center">
        <div>{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import SignUpForm from '@/components/signup-form'
import { MD5 } from 'object-hash'

export default {
  components: {
    SignUpForm,
  },
  data: () => {
    return {
      user: {
        firstname: 'Allan',
        lastname: 'Oricil',
        email: 'allanoricilcos2@outlook.com',
        password: '07021994aA@',
        passwordConfirmation: '07021994aA@',
      },
      complete: false,
      submited: false,
      mountCard: false,
      errors: [],
    }
  },
  methods: {
    ...mapActions({
      createKeygenUser: 'user/createKeygenUser',
      login: 'user/login',
      fetchKeygenUser: 'user/fetchKeygenUser'
    }),
    submit() {
      this.errors = []
      this.submited = true
      this.$refs['sign-up-form'].$v.$touch()
      if (!this.$refs['sign-up-form'].$v.$invalid) {
        const attributes = {
          firstName: this.user.firstname,
          lastName: this.user.lastname,
          email: this.user.email,
          password: MD5(this.user.password),
          metadata: {
            partnerId: this.$route.query.partnerId,
          },
        }
        this.createKeygenUser({ attributes })
          .then(() => {
            this.login({
              email: this.user.email,
              password: this.user.password,
            })
            .then(() => {
              this.fetchKeygenUser()
              .then(() => this.$router.push({ name: 'editor' }))
              .catch(() => this.router.push({ name:  'signin' }))
            })
            .catch(() => this.$router.push({ name: 'signin' }))
          })
          .catch((error) => {
            error.response.data.errors.forEach((error) => {
              if (error.code === 'EMAIL_TAKEN') {
                this.errors = 'E-mail has already been taken. Choose a different E-mail and try again.';
              } else {
                this.errors = error.detail;
              }
            })
          })
          .finally(() => (this.submited = false))
      }
    },
  },
}
</script>

<style></style>
