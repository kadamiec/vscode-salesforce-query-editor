<template>
  <div class="d-flex vw-100 vh-100 px-5">
    <div class="d-flex mx-auto">
      <div class="d-flex flex-column my-auto" style="width: 350px">
        <logo class="mx-auto mb-3"></logo>
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
      <div v-if="!isVSCode" class="my-auto pl-5">
        <h3>Features</h3>
        <ul>
          <li>SOQL Builder</li>
          <li>Execute SOQL Queries</li>
          <li>Get SOQL Query Plans</li>
          <li>Update, Create and Delete Records</li>
          <li>Add Relationship Fields</li>
          <li>Add Child Parent Relationship Fields</li>
          <li>Works with any VS Code Theme</li>
          <li>Works side by side with your Apex Class</li>
          <li>
            Access Field Details, such as Name, Label, Required, Updateable,
            Groupable and more
          </li>
          <li>
            Compact to not take away the space you have available while writing
            code
          </li>
          <li>A lot more...</li>
        </ul>
        <h3>Paid Features</h3>
        <ul>
          <li>Remove BUY PRO golden button and any other Propaganda.</li>
          <li>Window Mode</li>
          <li>Desktop App (PWA)</li>
          <li>
            Quickly update or add a new Query to apex using Add to Apex and
            Update Apex buttons
          </li>
          <li>Quickly run Queries</li>
          <li>Run multiple queries in different tabs</li>
        </ul>
        <button class="vscode-button btn" @click="onClickLearnMoreButton">
          Learn more
        </button>
        <button class="vscode-button btn" @click="onClickInstallItNowButton">
          Install it Now
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SignUpForm from '@/components/signup-form'
import { MD5 } from 'object-hash'
import Logo from '@/components/logo'

export default {
  components: {
    SignUpForm,
    Logo,
  },
  data: () => {
    return {
      user: {
        firstname: null,
        lastname: null,
        email: null,
        password: null,
        passwordConfirmation: null,
      },
      complete: false,
      submited: false,
      mountCard: false,
      error: null,
    }
  },
  computed: {
    ...mapState({
      isVSCode: (state) => state.user.isVSCode,
    }),
  },
  mounted() {
    localStorage.setItem('partnerId', this.$route.query.partnerId)
  },
  methods: {
    ...mapActions({
      login: 'user/login',
      fetchKeygenUser: 'user/fetchKeygenUser',
    }),
    submit() {
      this.error = null
      this.$refs['sign-up-form'].$v.$touch()
      this.submited = true
      if (this.$refs['sign-up-form'].$v.$invalid) {
        this.submited = false
      } else {
        const password = MD5(this.user.password)
        const attributes = {
          firstName: this.user.firstname,
          lastName: this.user.lastname,
          email: this.user.email,
          password,
          metadata: {
            partnerId: localStorage.getItem('partnerId') || null,
          },
        }
        this.createKeygenUser(attributes)
          .then(() => {
            this.$router.push({ name: 'success-signup' })
          })
          .catch((error) => {
            error.response.data.errors.forEach((error) => {
              if (error.code === 'EMAIL_TAKEN') {
                this.error =
                  'E-mail has already been taken. Choose a different E-mail and try again.'
              } else {
                this.error =
                  "Sorry, your account couldn't be created at the moment. Try again later."
              }
            })
          })
          .finally(() => (this.submited = false))
      }
    },
    createKeygenUser(attributes) {
      return this.$axios.post(
        `https://api.keygen.sh/v1/accounts/${process.env.KEYGEN_ACCOUNT_ID}/users`,
        {
          data: { type: 'users', attributes },
        },
        {
          headers: {
            'Content-Type': 'application/vnd.api+json',
            Accept: 'application/vnd.api+json',
          },
        }
      )
    },
    onClickLearnMoreButton() {
      this.$router.push({ name: 'product-description' })
    },
    onClickInstallItNowButton() {
      window.open(
        'https://marketplace.visualstudio.com/items?itemName=allanoricil.salesforce-soql-editor',
        '__blank'
      )
      window.open('vscode:extension/allanoricil.salesforce-soql-editor')
    },
  },
}
</script>

<style></style>
