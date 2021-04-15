import axios from 'axios'

export default async function ({ store, redirect, route }) {
  if (!store.state.user?.auth?.token) {
    try {
      const response = await axios.get(
        `${process.env.SALESFORCE_SERVER}/vscode/login`,
        {
          headers: {
            'Content-Type': 'application/vnd.api+json',
            Accept: 'application/vnd.api+json',
          },
        }
      )

      if (response.data.login.email && response.data.login.password) {
        try {
          await store.dispatch('user/login', {
            email: response.data.login.email,
            password: response.data.login.password,
          })
          await store.dispatch('user/fetchKeygenUser')
          if (route.name !== 'editor') redirect('/editor')
        } catch {
          if (route.name !== 'signin') redirect('/signin')
        }
      } else if (route.name !== 'signin') redirect('/signin')
    } catch {
      if (route.name !== 'signin') redirect('/signin')
    }
  }
}
