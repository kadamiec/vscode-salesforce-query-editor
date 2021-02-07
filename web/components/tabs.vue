<template>
  <div class="d-flex flex-column vh-100 vw-100">
    <div class="tab-header d-flex w-100 flex-wrap">
      <div
        v-for="(tab, tabIndex) in tabs"
        :key="tab.name"
        class="d-flex tab justify-content-between"
        :class="{ active: tab.name === value }"
      >
        <div class="tab-name d-flex" @click="onClickTab(tab.name)">
          <div class="my-auto">
            {{ tab.label }}
          </div>
        </div>
        <button
          class="tab-close-button my-auto"
          @click.prevent="onClickRemoveTab({ name: tab.name, index: tabIndex })"
        >
          <i class="fa fa-close"></i>
        </button>
      </div>
      <button class="tab add-tab-button" @click="onClickNewTab">
        <i class="fa fa-plus px-auto"></i>
      </button>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: null,
    },
  },
  data: () => {
    return {
      tabs: {},
      counter: 0
    }
  },
  created(){
    this.tabs = this.$children;
  },
  methods: {
    onClickNewTab() {
      this.counter++;
      this.$emit('newTab', { name: 'editor-' + this.counter, label: 'Editor'});
    },
    onClickRemoveTab({name, index}) {
      this.$emit('removeTab', {name, index});
    },
    onClickTab(name) {
      this.$emit('activate', name);
    },
  },
}
</script>

<style scopped>
.tab-header {
  border-bottom: 1px solid var(--vscode-input-background) !important;
  height: 35px;
}

.tab {
  width: 90px;
  cursor: pointer;
  padding: 0px;
  border: none;
  border-radius: 0 !important;
  background-color: var(--vscode-input-background) !important;
  color: var(--vscode-input-foreground) !important;
  height: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tab .tab-name {
  padding-left: 10px;
  width: 100%;
}

.tab.active,
.tab:hover {
  border-color: transparent !important;
  background-color: var(--vscode-button-background) !important;
  color: var(--vscode-button-foreground) !important;
}

.tab button {
  padding-right: 10px;
  background-color: transparent;
  color: var(--vscode-input-foreground) !important;
  border: none;
}

.tab-close-button {
  border: none;
  background-color: transparent;
}

.tab-close-button:hover {
  color: var(--vscode-button-foreground) !important;
}

.add-tab-button {
  width: 40px;
}
</style>
