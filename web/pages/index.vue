<template>
  <div>
    <loading />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import Loading from '@/components/loading'

export default {
  name: 'App',
  components: {
    Loading,
  },
  middleware: 'validate-keygen-license',
  created() {
    this.fetchEnvironments()
    this.fetchConfiguration()
    this.fetchDefaultusername().then(() => {
      this.$router.push({ name: 'editor' })
    })
  },
  sockets: {
    connect(){
      console.log('connected');
    },
    testMessage(){
      console.log('test Message');
    }
  },
  computed: {
    ...mapState({
      configuration: (state) => state.user.configuration,
    }),
  },
  methods: {
    ...mapActions({
      fetchEnvironments: 'salesforce/fetchEnvironments',
      fetchDefaultusername: 'salesforce/fetchDefaultusername',
      fetchConfiguration: 'user/fetchConfiguration'
    }),
    ...mapMutations({
      setSalesforceDefaultusername: 'salesforce/setSalesforceDefaultusername',
    }),
  },
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.5s;
  transition-property: opacity;
  transition-timing-function: ease-in;
}

.fade-enter-active {
  transition-delay: 0.5s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
