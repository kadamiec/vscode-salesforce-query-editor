import Vue from 'vue'
import VueGtag from 'vue-gtag'

export default ({ app }) => {
  const getGDPR = localStorage.getItem('GDPR:accepted')
  Vue.use(
    VueGtag,
    {
      config: { id: 'G-N0T23MTND1' },
      appName: 'Salesforce Query Editor',
      bootstrap: getGDPR === 'true',
      enabled: getGDPR === 'true',
      pageTrackerScreenviewEnabled: true,
    },
    app.router
  )
}
