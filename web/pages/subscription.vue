<template>
  <div class="d-flex flex-column px-5 pt-4 vh-100 h-100">
    <div v-if="subscriptionsLoaded" class="m-auto" style="width: 490px">
      <div class="text-center mb-2" style="font-size: 20px">
        Select your Subscription Plan
      </div>
      <div class="d-flex justify-content-center mt-2">
        <div
          v-for="(subscriptionPlan, subscriptionPlanIndex) in stripe.price
            .subscriptionPlans"
          :key="subscriptionPlan.id"
          @click="
            isPaying
              ? null
              : onClickSubscriptionPlan(subscriptionPlan, subscriptionPlanIndex)
          "
        >
          <div
            class="card mb-2 mr-3 noselect"
            :class="{
              selected: subscriptionPlanIndex === stripe.subscriptionPlan,
              disabled: isPaying,
            }"
          >
            <div class="card-body d-flex flex-column">
              <div class="mx-auto subscription-amount">
                ${{
                  subscriptionPlan.amount
                    ? (
                        (stripe.numberOfLicenses * subscriptionPlan.amount) /
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
        v-if="$v.stripe.subscriptionPlan.$error"
        class="error text-center form-text"
      >
        You must choose a Subscription Plan.
      </div>

      <div class="d-flex flex-column">
        <input
          id="number-of-licenses"
          v-model.number="$v.stripe.numberOfLicenses.$model"
          type="range"
          min="1"
          max="100"
          class="form-control"
          :disabled="isPaying"
        />
        <div
          for="number-of-licenses"
          class="text-center"
          style="font-size: 20px"
        >
          {{
            stripe.numberOfLicenses +
            (stripe.numberOfLicenses === 1 ? ' License' : ' Licenses')
          }}
        </div>
        <div class="form-text text-center">
          Drag the slider to increase the number of Licenses
        </div>
      </div>

      <div
        class="d-flex flex-column mt-3"
        style="font-size: 15px; color: var(--vscode-input-foreground)"
      >
        <div class="text-center mb-2" style="font-size: 20px">
          Purchase Summary
        </div>
        <div class="d-flex justify-content-between">
          <div>Product:</div>
          <div style="font-weight: bold">Salesforce Query Editor Pro</div>
        </div>
        <div class="d-flex justify-content-between">
          <div>Subscription Value:</div>
          <div style="font-weight: bold">
            ${{ stripe.price.amount ? stripe.price.amount.toFixed(2) : 0.0 }}
            USD
          </div>
        </div>
        <div class="d-flex justify-content-between">
          <div>Number of Licenses:</div>
          <div style="font-weight: bold">{{ stripe.numberOfLicenses }}</div>
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
          ref="cardholder-name"
          v-model="$v.stripe.cardholderName.$model"
          class="form-control"
          type="text"
          :disabled="isPaying"
        />
        <template v-if="$v.stripe.cardholderName.$error">
          <div class="error form-text">Name on Card is required.</div>
        </template>
      </div>
      <label for="stripe-card">Credit or debit card</label>
      <card
        v-if="mountCard"
        id="stripe-card"
        ref="stripe-card"
        class="stripe-card"
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
        class="vscode-button mt-3 btn-block"
        :disabled="isPaying"
        @click.prevent="submit()"
      >
        Pay ${{ total ? total.toFixed(2) : 0.0 }} USD
        <i v-if="isPaying" class="fa fa-circle-o-notch fa-spin" />
      </button>

      <button
        :disabled="isPaying"
        class="vscode-button mt-3 btn-block"
        @click.prevent="onClickCancel"
      >
        Cancel
      </button>

      <div v-if="errors" class="error text-center">
        <div v-for="(error, errorIndex) in errors" :key="errorIndex">
          <div v-if="error.showCode">Code: {{ error.code }}</div>
          <div>{{ error.message }}</div>
        </div>
      </div>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
import { Card, createToken } from 'vue-stripe-elements-plus'
import { required, minValue } from 'vuelidate/lib/validators'
import { mapActions, mapState } from 'vuex'
import Loading from '@/components/loading'
import capitalizeFirstLetter from '~/mixins/capitelize-first-letter'

export default {
  components: {
    Card,
    Loading,
  },
  mixins: [capitalizeFirstLetter],
  middleware: ['auth'],
  data: () => {
    return {
      complete: false,
      submited: false,
      stripe: {
        cardholderName: null,
        subscriptionPlan: null,
        numberOfLicenses: 1,
        price: {
          subscriptionPlans: null,
          amount: 0,
          taxPercentage: 0,
        },
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        options: {
          disabled: false,
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
    stripe: {
      cardholderName: {
        required,
      },
      subscriptionPlan: {
        required,
      },
      numberOfLicenses: {
        required,
        min: minValue(1),
      },
    },
  },
  computed: {
    ...mapState({
      auth: (state) => state.user.auth,
      user: (state) => state.user.user,
    }),
    total() {
      return (
        this.stripe.numberOfLicenses *
        (this.stripe.price.taxPercentage
          ? this.stripe.price.amount *
            (1 + this.stripe.price.taxPercentage / 100)
          : this.stripe.price.amount)
      )
    },
    subscriptionsLoaded() {
      return !!this.stripe.price.subscriptionPlans
    },
  },
  watch: {
    subscriptionsLoaded(newValue) {
      this.$nextTick(() => {
        if (newValue) {
          const inputElem = this.$refs['cardholder-name']
          const inputComputedStyles = window.getComputedStyle(inputElem, null)
          const fontSize = inputComputedStyles.getPropertyValue('font-size')
          const inputForegroundColor = inputComputedStyles.getPropertyValue(
            '--vscode-input-foreground'
          )
          const labelFontFamily = inputComputedStyles.getPropertyValue(
            '--vscode-font-family'
          )

          this.stripe.options.style.base.fontSize = fontSize
          this.stripe.options.style.base.color = inputForegroundColor
          this.stripe.options.style.base.fontFamily = labelFontFamily
          this.stripe.options.style.invalid[
            ':focus'
          ].color = inputForegroundColor
          this.stripe.options.style.base.iconColor = inputForegroundColor
          this.stripe.options.style.base[
            '::placeholder'
          ].color = inputForegroundColor

          this.$nextTick(() => {
            this.mountCard = true
            console.log(this.stripe.options)
          })
        }
      })
    },
  },
  async beforeMount() {
    try {
      const plansResponse = await this.$axios.get(
        `${process.env.WEBHOOKS_SERVER}/plans`
      )
      this.stripe.price.subscriptionPlans = plansResponse.data
    } catch {
      return this.$nuxt.error({ message: 'Could not fetch Subscription Plans' })
    }
  },
  methods: {
    ...mapActions({
      login: 'user/login',
      createLicenses: 'user/createLicenses',
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
              this.$nextTick(() => {
                this.isPaying = true
                this.stripe.options.disabled = true
                this.$refs['stripe-card'].update(this.stripe.options)
              })
              createToken({
                name: this.stripe.cardholderName,
                email: this.user.email,
              })
                .then((createTokenResponse) => {
                  if (createTokenResponse.error) {
                    this.errors.push({
                      message: createTokenResponse.error.message,
                    })
                    this.isPaying = false
                  } else {
                    this.createLicenses({
                      quantity: this.stripe.numberOfLicenses,
                      stripePlanId: this.stripe.price.subscriptionPlans[
                        this.stripe.subscriptionPlan
                      ].id,
                      stripeToken: createTokenResponse.token.id,
                    })
                      .then(() => {
                        this.isPaying = false
                        this.stripe.options.disabled = false
                        this.$refs['stripe-card'].update(this.stripe.options)
                        this.$router.push({
                          name: 'success-subscription',
                          params: {
                            error: false,
                          },
                        })
                      })
                      .catch(() => {
                        this.isPaying = false
                        this.errors.push({
                          message: 'Could not Subscribe',
                        })
                      })
                  }
                })
                .catch(() => {
                  this.errors.push({
                    message: 'Could not create Stripe Token',
                  })
                })
            }
          })
      }
    },
    onClickSubscriptionPlan(subscriptionPlan, selectedSubscriptionPlanIndex) {
      this.stripe.price.amount = subscriptionPlan.amount / 100
      this.stripe.subscriptionPlan = selectedSubscriptionPlanIndex
    },
    onClickCancel() {
      this.$router.push({ name: 'account' })
    },
  },
}
</script>

<style scoped>
input {
  height: 35px;
  font-size: 15px !important;
}
.stripe-card {
  padding: 6px;
  height: 35px;
  border: thin solid var(--vscode-inputOption-activeBackground);
}

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
  color: var(--vscode-button-foreground) !important;
}

.card.disabled {
  cursor: default;
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
</style>
