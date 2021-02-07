export default function ({ store, redirect }) {
  if (!store.state.user?.auth?.token) {
    redirect('/signin')
  }
}
