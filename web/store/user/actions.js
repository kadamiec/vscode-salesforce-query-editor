export default {
  login({ commit }, { email, password }) {
    return this.$axios
      .post(
        `https://api.keygen.sh/v1/accounts/${process.env.KEYGEN_ACCOUNT_ID}/tokens`,
        null,
        {
          headers: {
            'Content-Type': 'application/vnd.api+json',
            Accept: 'application/vnd.api+json',
            Authorization: `Basic ${window.btoa(`${email}:${password}`)}`,
          },
        }
      )
      .then((authResponse) => {
        commit('setAuth', { ...authResponse.data, email })
      })
  },
  fetchKeygenUser({ commit, state }) {
    return this.$axios
      .get(
        `https://api.keygen.sh/v1/accounts/${process.env.KEYGEN_ACCOUNT_ID}/users/${state.auth.userId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state.auth.token}`,
          },
        }
      )
      .then((userResponse) => {
        commit('setUser', userResponse.data.data.attributes)
      })
  },
  async validateLicense({ state, commit }, key) {
    console.log(key)
    try {
      const response = await this.$axios.post(
        `https://api.keygen.sh/v1/accounts/${process.env.KEYGEN_ACCOUNT_ID}/licenses/actions/validate-key`,
        {
          meta: {
            key: key || state.license.key,
            scope: {
              fingerprint: state.fingerprint,
            },
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      )

      commit('setLicense', {
        meta: response.data.meta,
        data: response.data.data,
      })

      return response
    } catch (error) {
      console.error(error)
      commit('setLicense', {
        status: 'invalid',
        errors,
      })
    }
  },
  async fetchSubscriptions({ state, commit }) {
    const licensesRequest = this.$axios.get(
      `https://api.keygen.sh/v1/accounts/${process.env.KEYGEN_ACCOUNT_ID}/licenses?limit=100`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.auth.token}`,
        },
      }
    )

    const subscriptionsRequest = this.$axios.get(
      `${process.env.WEBHOOKS_SERVER}/subscriptions/${state.user.metadata.stripeCustomerId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    )

    try {
      const responses = await Promise.all([
        licensesRequest,
        subscriptionsRequest,
      ])
      const subscriptions = responses[1].data.data
      const licenses = responses[0].data.data

      subscriptions.forEach((subscription) => {
        if (!subscription.licenses) subscription.licenses = []
        licenses.forEach((license) => {
          if (
            license.attributes.metadata.stripeSubscriptionId === subscription.id
          ) {
            subscription.licenses.push(license)
          }
        })
      })

      commit('setSubscriptions', subscriptions)

      return responses
    } catch (error) {
      console.error(error)
    }
  },
  async activateMachineUsingKey({ state, dispatch }, { key }) {
    const response = await this.$axios.post(
      `${process.env.WEBHOOKS_SERVER}/activate-machine`,
      {
        fingerprint: state.fingerprint,
        key,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    )

    await dispatch('validateLicense', key)
    await dispatch('saveLicense', { key })

    return response
  },
  async activateMachine(
    { state, dispatch },
    { subscriptionIndex, licenseIndex }
  ) {
    const license =
      state.subscriptions[subscriptionIndex].licenses[licenseIndex]
    const machineActivationResponse = await this.$axios.post(
      `https://api.keygen.sh/v1/accounts/${process.env.KEYGEN_ACCOUNT_ID}/machines`,
      {
        data: {
          type: 'machines',
          attributes: {
            fingerprint: state.fingerprint,
          },
          relationships: {
            license: {
              data: {
                type: 'licenses',
                id: license.id,
              },
            },
          },
        },
      },
      {
        headers: {
          'Content-Type': 'application/vnd.api+json',
          Accept: 'application/vnd.api+json',
          Authorization: `Bearer ${state.auth.token}`,
        },
      }
    )

    await dispatch('validateLicense', license.attributes.key)
    await dispatch('saveLicense', { key: license.attributes.key })

    return machineActivationResponse
  },
  fetchConfiguration({ commit }) {
    return this.$axios
      .get(`${process.env.SALESFORCE_SERVER}/vscode/configuration`)
      .then((result) => {
        commit('setConfiguration', result.data)
      })
      .catch((error) => {
        console.error(error)
      })
  },
  fetchMachineFingerprint({ commit }) {
    return this.$axios
      .get(`${process.env.SALESFORCE_SERVER}/vscode/fingerprint`)
      .then((response) => {
        commit('setFingerprint', response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  },
  fetchLicense(context, licenseUri) {
    return this.$axios.get(`https://api.keygen.sh${licenseUri}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authResponse.data.data.attributes.token}`,
      },
    })
  },
  async saveLicense(context, { key }) {
    return await this.$axios.post(
      `${process.env.SALESFORCE_SERVER}/vscode/license`,
      {
        key,
      }
    )
  },
  async fetchActivatedLicense({ commit }) {
    try {
      const response = await this.$axios.get(
        `${process.env.SALESFORCE_SERVER}/vscode/license`
      )
      commit('setLicensekey', { key: response.data.key })
      return response
    } catch (error) {
      console.error(error)
    }
  },
  async deactivateMachine(
    { state, dispatch },
    { subscriptionIndex, licenseIndex }
  ) {
    const licenseMachinesUri =
      state.subscriptions[subscriptionIndex].licenses[licenseIndex]
        .relationships.machines.links.related
    try {
      const machinesResponse = await this.$axios.get(
        `https://api.keygen.sh${licenseMachinesUri}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${state.auth.token}`,
          },
        }
      )

      const machineId = machinesResponse.data?.data[0]?.id

      try {
        const deactivateMachineResponse = await this.$axios.delete(
          `https://api.keygen.sh/v1/accounts/${process.env.KEYGEN_ACCOUNT_ID}/machines/${machineId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${state.auth.token}`,
            },
          }
        )

        await dispatch('deleteLicenseFromComputer')

        return deactivateMachineResponse
      } catch (error) {
        console.error('Could not deactivate machine')
      }
    } catch (error) {
      console.error('Could not located associated machine')
    }
  },
  async deleteLicenseFromComputer({ commit }) {
    try {
      await this.$axios.delete(
        `${process.env.SALESFORCE_SERVER}/vscode/license`
      )
      commit('deleteLicense')
    } catch (error) {
      console.error(error)
    }
  },
  async cancelSubscription(context, { userId, subscriptionId }) {
    try {
      const response = await this.$axios.post(
        `${process.env.WEBHOOKS_SERVER}/cancel-subscription`,
        {
          keygenUserId: userId,
          stripeSubscriptionId: subscriptionId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      )

      return response
    } catch (error) {
      console.error(error)
    }
  },
  async createLicenses(
    { state, commit },
    { quantity, stripePlanId, stripeToken }
  ) {
    const createLicensesResponse = await this.$axios.post(
      `${process.env.WEBHOOKS_SERVER}/create-licenses`,
      {
        quantity,
        stripePlanId,
        stripeToken,
        customerEmail: state.user.email,
        keygenUserId: state.auth.userId,
        stripeSubscriptionId: state.subscriptions.find(
          (subscription) => subscription.plan.id === stripePlanId
        )?.id,
        stripeCustomerId: state.user.metadata.stripeCustomerId,
      }
    )
    commit('setStripeUser', createLicensesResponse.data.stripeCustomer.id)
    return createLicensesResponse
  },
  fetchThemeColors({ commit }) {
    return this.$axios.get(
      `${process.env.SALESFORCE_SERVER}/vscode/colors`
    )
    .then((response) => {
      commit('setThemeColors', response.data.colors);
    })
    .catch((error) => {
      console.error(error)
    })
  }
}
