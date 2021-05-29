import { DateTime } from 'luxon'

export default {
  isLicenseValid: (state) => () => {
    return state.license?.meta?.valid
  },
  getUserEmail: (state) => () => {
    return state.auth.email
  },
  getUserLicenseKey: (state) => () => {
    return state.license?.meta?.valid
      ? state.license?.data?.attributes?.key
      : null
  },
  getSubscriptions: (state) => () => {
    return state.subscriptions.map((subscription) => {
      return {
        id: subscription.id,
        currentPeriodStart: subscription.current_period_start
          ? DateTime.fromMillis(
              subscription.current_period_start * 1000
            ).toFormat('dd LLL yyyy')
          : null,
        currentPeriodEnd: subscription.current_period_end
          ? DateTime.fromMillis(
              subscription.current_period_end * 1000
            ).toFormat('dd LLL yyyy')
          : null,
        status:
          subscription.status.charAt(0).toUpperCase() +
          subscription.status.slice(1),
        createdDate: subscription.created
          ? DateTime.fromMillis(subscription.created * 1000).toFormat(
              'dd LLL yyyy'
            )
          : null,
        quantity: subscription.quantity,
        value:
          '$ ' +
          ((subscription.quantity * subscription.plan.amount) / 100).toFixed(
            2
          ) +
          ' ' +
          subscription.plan.currency.toUpperCase(),
        total:
          '$ ' +
          (
            ((subscription.quantity * subscription.plan.amount) / 100) *
            subscription.quantity
          ).toFixed(2) +
          ' ' +
          subscription.plan.currency.toUpperCase(),
        canceledAt: subscription.canceled_at
          ? DateTime.fromMillis(subscription.canceled_at * 1000).toFormat(
              'dd LLL yyyy'
            )
          : null,
        endDate: subscription.cancel_at
          ? DateTime.fromMillis(subscription.cancel_at * 1000).toFormat(
              'dd LLL yyyy'
            )
          : null,
        licenses: subscription.licenses.map((license) => {
          return {
            id: license.id,
            key: license.attributes.key,
            expiry: DateTime.fromISO(license.attributes.expiry).toFormat(
              'dd LLL yyyy'
            ),
            machines: license.relationships.machines.meta.count,
            maxMachines: license.attributes.maxMachines,
            activated:
              license.relationships.machines.meta.count ===
              license.attributes.maxMachines
                ? 'Yes'
                : 'No',
          }
        }),
      }
    })
  },
}
