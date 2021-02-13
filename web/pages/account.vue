<template>
  <div style="overflow: auto">
    <transition name="fade">
      <loading v-if="!isDataReady"></loading>
      <div v-else class="d-flex flex-column vh-100 w-100 pt-3 pl-2 pl-md-4">
        <div>
          <div class="d-flex flex-column mb-2 pr-4" style="">
            <div class="user-info">{{ user.fullName }}</div>
            <div class="user-info">{{ user.email }}</div>
            <div class="d-flex mt-2">
              <button
                class="vscode-button btn mr-2"
                @click="onClickUpdatePassword"
              >
                Change Password
              </button>
              <button class="vscode-button btn mr-2" @click="onClickBuyLicense">
                Buy Licenses
              </button>
              <button
                v-if="!userLicenseKey"
                class="vscode-button btn"
                @click="onClickAddLicense"
              >
                Activate License
              </button>
            </div>
          </div>
        </div>
        <transition name="fade">
          <div
            v-if="subscriptions.length"
            class="d-flex flex-column w-100 mt-4"
            style="font-size: 18px"
          >
            <div style="font-size: 23px">Subscriptions</div>
            <b-table
              class="test"
              :items="subscriptions"
              :fields="subscriptionFields"
              small
              borderless
              responsive
            >
              <template #cell(actions)="row">
                <button
                  v-if="!row.item.canceledAt"
                  style="width: 110px"
                  class="vscode-button btn mb-2 mb-md-0"
                  :disabled="cancelSubscriptionButtonIndex"
                  @click="onClickCancelSubscription(row.item, row.index)"
                >
                  Cancel
                  <i
                    v-if="cancelSubscriptionButtonIndex === row.index"
                    class="fa fa-circle-o-notch fa-spin"
                  ></i>
                </button>
                <button
                  style="width: 110px"
                  class="vscode-button btn"
                  @click="row.toggleDetails"
                >
                  Licenses
                </button>
              </template>

              <template #row-details="row">
                <div class="mx-auto" style="width: 700px">
                  <b-table
                    class="test"
                    :items="row.item.licenses"
                    :fields="licenseFields"
                    small
                    borderless
                    responsive
                  >
                    <template #cell(actions)="licenseRow">
                      <transition name="fade">
                        <button
                          v-if="licenseRow.item.activated === 'Yes'"
                          class="vscode-button btn"
                          style="width: 100px"
                          :disabled="
                            licenseButton.subscriptionIndex === row.index &&
                            licenseButton.licenseIndex === licenseRow.index
                          "
                          @click="
                            onClickDeactivateLicense(
                              row.index,
                              licenseRow.index
                            )
                          "
                        >
                          Deactivate
                          <i
                            v-if="
                              licenseButton.subscriptionIndex === row.index &&
                              licenseButton.licenseIndex === licenseRow.index
                            "
                            class="fa fa-circle-o-notch fa-spin"
                          ></i>
                        </button>
                        <button
                          v-else-if="!userLicenseKey"
                          class="vscode-button btn"
                          style="width: 100px"
                          :disabled="
                            licenseButton.subscriptionIndex === row.index &&
                            licenseButton.licenseIndex === licenseRow.index
                          "
                          @click="
                            onClickActivateLicense(row.index, licenseRow.index)
                          "
                        >
                          Activate
                          <i
                            v-if="
                              licenseButton.subscriptionIndex === row.index &&
                              licenseButton.licenseIndex === licenseRow.index
                            "
                            class="fa fa-circle-o-notch fa-spin"
                          ></i>
                        </button>
                      </transition>
                    </template>
                  </b-table>
                </div>
              </template>
            </b-table>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { DateTime } from 'luxon'
import Loading from '@/components/loading'

export default {
  components: {
    Loading,
  },
  layout: 'loggedin',
  middleware: ['auth', 'menu'],
  data: () => {
    return {
      isDataReady: false,
      cancelSubscriptionButtonIndex: null,
      licenseButton: {
        subscriptionIndex: null,
        licenseIndex: null,
      },
      subscriptionFields: [
        {
          key: 'currentPeriodStart',
          label: 'Current Period Start',
          tdClass: 'no-wrap',
        },
        {
          key: 'currentPeriodEnd',
          label: 'Current Period End',
          tdClass: 'no-wrap',
        },
        {
          key: 'status',
          label: 'Status',
          tdClass: 'no-wrap',
        },
        {
          key: 'createdDate',
          label: 'Created Date',
          tdClass: 'no-wrap',
        },
        {
          key: 'quantity',
          label: 'Quantity',
          tdClass: 'no-wrap',
        },
        {
          key: 'value',
          label: 'Value',
          tdClass: 'no-wrap',
        },
        {
          key: 'total',
          label: 'Total',
          tdClass: 'no-wrap',
        },
        {
          key: 'canceledAt',
          label: 'Canceled Date',
          tdClass: 'no-wrap',
        },
        {
          key: 'endDate',
          label: 'End Date',
          tdClass: 'no-wrap',
        },
        {
          key: 'actions',
          label: '',
          tdClass: 'no-wrap',
        },
      ],
      licenseFields: [
        {
          key: 'key',
          label: 'Key',
        },
        {
          key: 'expiry',
          label: 'Expiry Date',
        },
        {
          key: 'activated',
          label: 'Activated',
        },
        {
          key: 'actions',
          label: '',
        },
      ],
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.user.user,
    }),
    ...mapGetters({
      getSubscriptions: 'user/getSubscriptions',
      getUserEmail: 'user/getUserEmail',
      getUserLicenseKey: 'user/getUserLicenseKey',
    }),
    userLicenseKey() {
      return this.getUserLicenseKey()
    },
    DateTime() {
      return DateTime
    },
    subscriptions() {
      return this.getSubscriptions()
    },
  },
  created() {
    this.fetchMachineFingerprint()
    this.fetchSubscriptions().then(() => (this.isDataReady = true))
  },
  methods: {
    ...mapActions({
      fetchSubscriptions: 'user/fetchSubscriptions',
      fetchMachineFingerprint: 'user/fetchMachineFingerprint',
      activateMachine: 'user/activateMachine',
      deactivateMachine: 'user/deactivateMachine',
      cancelSubscription: 'user/cancelSubscription',
    }),
    onClickCancelSubscription(subscription, subscriptionIndex) {
      this.$bvModal
        .msgBoxConfirm(
          `Are you sure you want to Cancel this Subscription?
           This will permanently delete all the licenses reated to this Subscription and every user that is using one of these licenses will lose access to the Pro Version of the Salesforce Query Editor after ${subscription.currentPeriodEnd}.
           You will no longer be charged for this Subscription after ${subscription.currentPeriodEnd}`,
          {
            centered: true,
          }
        )
        .then((value) => {
          if (value === true) {
            this.cancelSubscriptionButtonIndex = subscriptionIndex
            this.cancelSubscription({
              userId: this.user.metadata.stripeCustomerId,
              subscriptionId: subscription.id,
            })
              .then(async () => {
                await this.fetchSubscriptions()
                  .then(() => (this.isDataReady = true))
                  .finally(() => (this.cancelSubscriptionButtonIndex = null))
              })
              .catch(() => {
                this.showToastMessage('Could not cancel your Subscription.')
              })
          }
        })
    },
    onClickDeactivateLicense(subscriptionIndex, licenseIndex) {
      this.licenseButton.subscriptionIndex = subscriptionIndex
      this.licenseButton.licenseIndex = licenseIndex
      this.deactivateMachine({ subscriptionIndex, licenseIndex })
        .then(async () => {
          await this.fetchSubscriptions().then(() => (this.isDataReady = true))
        })
        .catch(() => {
          this.showToastMessage('Could not Deactivate your License.')
        })
        .finally(() => {
          this.licenseButton.subscriptionIndex = null
          this.licenseButton.licenseIndex = null
        })
    },
    onClickActivateLicense(subscriptionIndex, licenseIndex) {
      this.licenseButton.subscriptionIndex = subscriptionIndex
      this.licenseButton.licenseIndex = licenseIndex
      this.activateMachine({ subscriptionIndex, licenseIndex })
        .then(() => {
          this.fetchSubscriptions()
          .then(() => {
            this.showToastMessage('License was activated with success.')
          })
          .catch(() => {
            this.showToastMessage('Could not fetch your licenses.')
          })
          .finally(() => this.isDataReady = true)
        })
        .catch(() => {
          this.showToastMessage('Could not Activate your License.')
        })
        .finally(() => {
          this.licenseButton.subscriptionIndex = null
          this.licenseButton.licenseIndex = null
        })
    },
    onClickBuyLicense() {
      this.$router.push({ name: 'subscription' })
    },
    onClickAddLicense() {
      this.$router.push({ name: 'license-activation' })
    },
    showToastMessage(message) {
      this.$bvToast.toast(message, {
        toaster: 'b-toaster-bottom-right',
        solid: true,
        appendToast: true,
        noCloseButton: true,
      })
    },
    onClickUpdatePassword(){
      this.$router.push({name: 'update-password'})
    }
  },
}
</script>

<style scoped>
.user-info{
  font-size: 23px;
}

.license-card {
  min-width: 300px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to
/* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

/deep/ .table {
  color: var(--vscode-editor-foreground) !important;
}

/deep/ thead tr {
  white-space: nowrap !important;
}
</style>
