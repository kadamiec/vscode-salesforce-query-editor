<template>
  <div class="d-flex flex-column px-5 pt-4">
    <div class="text-center" style="font-size: 20px">
      Select your Subscription Plan
    </div>
    <div class="d-flex justify-content-center mt-2">
      <div
        v-for="(subscriptionPlan, subscriptionPlanIndex) in stripe.price
          .subscriptionPlans"
        :key="subscriptionPlan.id"
        class="subscription-card"
        @click="
          onClickSubscriptionPlan(subscriptionPlan, subscriptionPlanIndex)
        "
      >
        <div
          class="card mb-2 mr-3 noselect"
          :class="{ selected: subscriptionPlanIndex === user.subscriptionPlan }"
        >
          <div class="card-body d-flex flex-column">
            <div class="mx-auto subscription-amount">
              ${{
                subscriptionPlan.amount
                  ? (
                      (user.numberOfLicenses * subscriptionPlan.amount) /
                      100
                    ).toFixed(2)
                  : 0.0
              }}
              USD
            </div>
            <div class="mx-auto">
              Per {{ capitalizeFirstLetter(subscriptionPlan.interval) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="$v.user.subscriptionPlan.$error"
      class="error text-center form-text"
    >
      You must choose a Subscription Plan.
    </div>

    <div class="d-flex flex-column">
      <input
        id="number-of-licenses"
        v-model="$v.user.numberOfLicenses.$model"
        type="range"
        min="1"
        class="form-control"
      />
      <div for="number-of-licenses" class="text-center" style="font-size: 20px">
        {{
          user.numberOfLicenses +
          (user.numberOfLicenses === 1 ? ' License' : ' Licenses')
        }}
      </div>
      <div class="form-text text-center">
        Drag the slider to increase the number of Licenses
      </div>
    </div>

    <div class="text-center mt-4" style="font-size: 20px">
      Account Information
    </div>
    <div class="form-group required control-label">
      <label for="firstame" class="form-label">First Name</label>
      <input
        id="firstname"
        v-model="$v.user.firstname.$model"
        class="form-control"
      />
      <template v-if="$v.user.firstname.$error">
        <div class="error form-text">First Name is required.</div>
      </template>
    </div>

    <div class="form-group required control-label mt-2">
      <label for="lastname" class="form-label">Last Name</label>
      <input
        id="lastname"
        v-model="$v.user.lastname.$model"
        class="form-control"
      />
      <template v-if="$v.user.lastname.$error">
        <div class="error form-text">Last Name is required.</div>
      </template>
    </div>

    <div class="form-group required control-label mt-2">
      <label for="email" class="form-label">E-mail</label>
      <input
        id="email"
        v-model="$v.user.email.$model"
        class="form-control"
        type="text"
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
      />
      <div class="form-text" :class="{ error: $v.user.password.$error }">
        Password must have a minimum of eight characters, at least one letter,
        one number and one special character.
      </div>
    </div>

    <div class="form-group required control-label mt-2">
      <label for="passwordConfirmation" class="form-label"
        >Confirm Password</label
      >
      <input
        id="passwordConfirmation"
        v-model="$v.user.passwordConfirmation.$model"
        class="form-control"
        type="password"
      />
      <template v-if="$v.user.passwordConfirmation.$error">
        <div class="error form-text">Passwords do not match.</div>
      </template>
    </div>
    {{ hashedPassword }}

    <div class="form-group control-label mt-2">
      <template v-if="user.location && user.location.continent_code === 'EU'">
        <label for="vat-id" class="form-label">VAT ID</label>
        <input
          id="vat-id"
          v-model="user.vatId"
          class="form-control"
          type="text"
        />
      </template>
    </div>

    <div class="d-flex flex-column mt-3" style="font-size: 15px">
      <div class="text-center" style="font-size: 20px">Purchase Summary</div>
      <div class="d-flex justify-content-between">
        <div>Subscription Value:</div>
        <div style="font-weight: bold">
          ${{ stripe.price.amount ? stripe.price.amount.toFixed(2) : 0.0 }} USD
        </div>
      </div>
      <div class="d-flex justify-content-between">
        <div>Number of Licenses:</div>
        <div style="font-weight: bold">{{ user.numberOfLicenses }}</div>
      </div>
      <div class="d-flex justify-content-between">
        <div>Total:</div>
        <div style="font-weight: bold">
          ${{ total ? total.toFixed(2) : 0.0 }} USD
        </div>
      </div>
    </div>

    <div class="text-center mt-2" style="font-size: 20px">Payment</div>

    <div class="form-group required control-label mt-2">
      <label for="cardholder-name" class="form-label">Name on Card</label>
      <input
        id="cardholder-name"
        v-model="$v.stripe.cardholderName.$model"
        class="form-control"
        type="text"
      />
      <template v-if="$v.stripe.cardholderName.$error">
        <div class="error form-text">Name on Card is required.</div>
      </template>
    </div>
    <label ref="stripe-card-label" for="stripe-card"
      >Credit or debit card</label
    >
    <card
      v-if="mountCard"
      id="stripe-card"
      :class="{ complete }"
      :stripe="stripe.publishableKey"
      :options="stripe.options"
      @change="complete = $event.complete"
    >
    </card>

    <template v-if="submited && !complete">
      <div class="error form-text">
        Please fill in the card Information correctly.
      </div>
    </template>

    <button
      id="pay-button"
      ref="pay-button"
      type="reset"
      variant="primary"
      class="vscode-button btn mt-3 btn-block"
      style="height: 40px; font-size: 20px"
      @click.prevent="submit()"
    >
      Pay ${{ total ? total.toFixed(2) : 0.0 }} USD
      <i v-if="isPaying" class="fa fa-circle-o-notch fa-spin" />
    </button>

    <div v-if="errors" class="error text-center">
      <div v-for="(error, errorIndex) in errors" :key="errorIndex">
        <div v-if="error.showCode">Code: {{ error.code }}</div>
        <div>{{ error.message }}</div>
      </div>
    </div>

    <div class="mt-2" style="position: relative; height: 200px">
      <img
        id="powered-by-stripe-img"
        src="~/assets/images/poweredbystripe.svg?data"
      />
    </div>
  </div>
</template>

<script>
// @ts-ignore
import { Card, createToken } from 'vue-stripe-elements-plus'
import {
  required,
  sameAs,
  email,
  minValue,
  helpers,
} from 'vuelidate/lib/validators'
import { MD5 } from 'object-hash'
import { mapActions } from 'vuex'

const passwordValidator = helpers.regex(
  'alpha',
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
)

export default {
  name: 'SignUp',
  components: {
    Card,
  },
  data: () => {
    return {
      user: {
        firstname: 'Allan',
        lastname: 'Oricil',
        email: 'allanoricil@outlook.com',
        password: '07021994aA@',
        passwordConfirmation: '07021994aA@',
        vatId: null,
        subscriptionPlan: null,
        numberOfLicenses: 1,
      },
      complete: false,
      submited: false,
      stripe: {
        cardholderName: 'Allan Oricil',
        price: {
          subscriptionPlans: null,
          amount: 0,
          taxPercentage: 0,
        },
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        options: {
          style: {
            base: {
              iconColor: null,
              color: null,
              fontSize: '20px',
              fontFamily: null,
              fontSmoothing: 'antialiased',
              '::placeholder': {
                color: null,
              },
            },
            invalid: {
              color: '#e5424d',
              ':focus': {
                color: null,
              },
            },
          },
        },
      },
      mountCard: false,
      errors: [],
      isPaying: false,
    }
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
      subscriptionPlan: {
        required,
      },
      numberOfLicenses: {
        required,
        min: minValue(1),
      },
    },
    stripe: {
      cardholderName: {
        required,
      },
    },
  },
  computed: {
    total() {
      return (
        this.user.numberOfLicenses *
        (this.stripe.price.taxPercentage
          ? this.stripe.price.amount *
            (1 + this.stripe.price.taxPercentage / 100)
          : this.stripe.price.amount)
      )
    } /*
    taxAmount() {
      return this.total - this.user.numberOfLicenses * this.stripe.price.amount
    }, */,
    hashedPassword() {
      return MD5(this.user.password)
    },
  },
  async beforeMount() {
    try {
      /*
      const promisesResponses = await Promise.all([
        /*this.$axios.get(
          `http://api.ipstack.com/109.79.93.183?access_key=${process.env.IP_STACK_ACCESS_KEY}`
        ),
        this.$axios.get(`${process.env.WEBHOOKS_SERVER}/plans`),
      ])

      const userLocation = promisesResponses[0]
      this.user.location = userLocation.data

      const plansResponse = promisesResponses[1]
      this.stripe.price.subscriptionPlans = plansResponse.data

      if (this.user.location && this.user.location.country_code) {
        const response = await this.axios.get(
          `${process.env.WEBHOOKS_SERVER}/tax-rates?country_code=${this.user.location.country_code}`
        )
        this.stripe.price.taxPercentage = response.data.percentage
      } else {
        console.error('Could not Locate User.')
      } */

      const plansResponse = await this.$axios.get(
        `${process.env.WEBHOOKS_SERVER}/plans`
      )
      this.stripe.price.subscriptionPlans = plansResponse.data
    } catch (error) {
      console.error(error)
    }
  },
  mounted() {
    const labelElem = this.$refs['stripe-card-label']
    const labelForegroundColor = window
      .getComputedStyle(labelElem, null)
      .getPropertyValue('--vscode-menu-foreground')
    const labelFontFamily = window
      .getComputedStyle(labelElem, null)
      .getPropertyValue('--vscode-font-family')

    this.stripe.options.style.base.color = labelForegroundColor
    this.stripe.options.style.base.fontFamily = labelFontFamily
    this.stripe.options.style.invalid[':focus'].color = labelForegroundColor
    this.stripe.options.style.base.iconColor = labelForegroundColor
    this.stripe.options.style.base['::placeholder'].color = labelForegroundColor

    this.$nextTick(() => {
      this.mountCard = true
      console.log(this.stripe.options)
    })
  },
  methods: {
    ...mapActions({
      login: 'user/login',
    }),
    submit() {
      this.errors = []
      this.submited = true
      this.$v.$touch()
      if (!this.$v.$invalid && this.complete) {
        this.$bvModal
          .msgBoxConfirm('Are you sure you want to proceed?', {
            centered: true,
          })
          .then((value) => {
            if (value === true) {
              this.$nextTick(() => (this.isPaying = true))
              createToken({
                name: this.stripe.cardholderName,
                email: this.user.email,
              }).then(async (createTokenResponse) => {
                if (createTokenResponse.error) {
                  this.errors.push({
                    message: createTokenResponse.error.message,
                  })
                } else {
                  const attributes = {
                    firstName: this.user.firstname,
                    lastName: this.user.lastname,
                    email: this.user.email,
                    password: MD5(this.user.password),
                    metadata: {
                      stripeToken: createTokenResponse.token.id,
                      stripeSubscriptionPlan: this.stripe.price
                        .subscriptionPlans[this.user.subscriptionPlan].id,
                      stripeQuantity: this.user.numberOfLicenses,
                    }, // Temporarily store this so our webhooks can do their thing
                  }
                  // Create the Keygen user
                  try {
                    await this.$axios.post(
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

                    this.login({
                      email: this.user.email,
                      password: this.user.password,
                    }).then(() => {
                      this.$router.push({
                        name: 'success-subscription',
                        params: {
                          error: false,
                        },
                      })
                    })
                  } catch (error) {
                    error.response.data.errors.forEach((error) => {
                      if (error.code === 'EMAIL_TAKEN') {
                        this.errors.push({
                          code: error.code,
                          message:
                            'E-mail has already been taken. Choose a different E-mail and try again.',
                          showCode: false,
                        })
                      } else {
                        this.errors.push({
                          code: error.code,
                          message: error.detail,
                          showCode: true,
                        })
                      }
                    })
                  }
                }
                this.isPaying = false
              })
            }
          })
      }
    },
    onClickSubscriptionPlan(subscriptionPlan, selectedSubscriptionPlanIndex) {
      this.stripe.price.amount = subscriptionPlan.amount / 100
      this.user.subscriptionPlan = selectedSubscriptionPlanIndex
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
  },
}
</script>

<style scoped>
.StripeElement {
  height: 30px;
  padding: 2px 12px;
  width: 100%;
  border: 1px solid var(--vscode-inputOption-activeBackground) !important;
  border-radius: 0 !important;
  background-color: var(--vscode-input-background) !important;
  color: var(--vscode-input-foreground) !important;
}

.StripeElement--invalid {
  border-color: #fa755a;
}

.StripeElement--webkit-autofill {
  background-color: var(--vscode-input-background) !important;
}

.card {
  width: 180px;
  border-radius: 0px !important;
  cursor: pointer;
  max-width: 20rem;
  background-color: var(--vscode-button-background) !important;
}

.card.selected,
.card:hover {
  color: var(--vscode-button-foreground) !important;
  background-color: var(--vscode-button-hoverBackground) !important;
}

.subscription-amount {
  font-size: 20px;
  font-weight: bold;
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}

#powered-by-stripe-img {
  height: 150px;
  position: absolute;
  left: -25px;
  top: -50px;
}

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
