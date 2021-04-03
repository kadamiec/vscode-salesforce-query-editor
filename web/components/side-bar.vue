<template>
  <div
    id="side-bar"
    :class="{ active: active }"
    class="d-flex flex-column justify-content-between"
  >
    <div v-if="active" class="d-flex flex-column">
      <div
        class="menu-button d-flex"
        :class="{ active: activeMenu === 'account' }"
        @click="onClickAccountButton"
      >
        <i class="codicon codicon-account m-auto"></i>
      </div>
      <div
        v-if="isLicenseValid()"
        class="menu-button d-flex"
        :class="{ active: activeMenu === 'editor' }"
        @click="onClickEditorButton"
      >
        <i class="codicon codicon-table m-auto"></i>
      </div>
    </div>
    <div v-if="active" class="d-flex flex-column">
      <div class="menu-button d-flex" @click="onClickLogout">
        <i class="codicon codicon-sign-out m-auto"></i>
      </div>
      <div class="menu-button d-flex" @click="onClickHelpButton">
        <i class="codicon codicon-question m-auto"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  props: {
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  computed: {
    ...mapState({
      activeMenu: (state) => state.user.activeMenu,
    }),
    ...mapGetters({
      isLicenseValid: 'user/isLicenseValid',
    }),
  },
  methods: {
    onClickAccountButton() {
      this.$router.push({ name: 'account' })
    },
    onClickEditorButton() {
      this.$router.push({ name: 'editor' })
    },
    onClickHelpButton() {
      window.open(
        'https://github.com/AllanOricil/SOQL-Editor-Issues/issues/new',
        '_blank'
      )
    },
    onClickLogout() {
      this.asyncPush({ name: 'signin' }).then(() => {
        this.$store.dispatch('reset')

        this.$axios.post(
          `${process.env.SALESFORCE_SERVER}/vscode/login`,
          {
            login: {},
          },
          {
            headers: {
              'Content-Type': 'application/vnd.api+json',
              Accept: 'application/vnd.api+json',
            },
          }
        )
      })
    },
    asyncPush(route) {
      return new Promise((resolve, reject) => {
        this.$router.push(route, resolve, reject)
      })
    },
  },
}
</script>

<style scoped>
@import '~/node_modules/vscode-codicons/dist/codicon.css';
#side-bar {
  opacity: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  position: fixed;
  height: 100%;
  width: 0px;
  border-right: 0.5px solid var(--vscode-activityBar-border);
  transition: width 0.2s linear, opacity 0.05s linear;
  overflow-x: hidden;
  background-color: var(--vscode-activityBar-background);
}

#side-bar.active {
  width: var(--side-bar-size);
  opacity: 1;
}

.menu-button {
  height: calc(var(--side-bar-size) - 2px);
  cursor: pointer;
  color: var(--vscode-activityBar-inactiveForeground);
  border-left: 2px solid transparent;
}

.menu-button:hover {
  color: var(--vscode-activityBar-foreground);
}

.menu-button.active {
  color: var(--vscode-activityBar-foreground);
  border-left: 2px solid var(--vscode-activityBar-foreground);
}

.codicon {
  font-size: 24px !important;
}
</style>
