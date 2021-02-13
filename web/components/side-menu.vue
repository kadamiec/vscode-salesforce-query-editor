<template>
  <div id="side-menu-container" :class="isOpen" tabindex="0" @keyup.esc="close">
    <div class="position-relative">
      <div id="side-menu-backdrop"></div>
      <div class="vw-100 position-absolute">
        <div class="d-flex justify-content-end">
          <div id="side-menu" class="d-flex flex-column">
            <div class="d-flex justify-content-between mr-2 mt-2">
              <slot name="left-button"></slot>
              <slot name="close">
                <i
                  class="fa fa-close fa-lg ml-auto"
                  style="margin-right: 5px"
                  @click="close"
                ></i>
              </slot>
            </div>
            <slot style="overflow-y: auto"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      closed: true,
    }
  },
  computed: {
    isOpen() {
      return this.closed ? 'd-none' : 'active'
    },
  },
  mounted() {
    window.addEventListener('keyup', this.onEscapeKeyUp)
  },
  destroyed() {
    window.removeEventListener('keyup', this.onEscapeKeyUp)
  },
  methods: {
    onEscapeKeyUp(event) {
      if (event.which === 27) {
        this.close()
      }
    },
    open() {
      this.closed = false
    },
    close() {
      this.closed = true
      this.$emit('close')
    },
  },
}
</script>

<style scoped>
#side-menu-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
  width: 0px;
}

#side-menu-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  background-color: black;
  opacity: 0.5;
}

#side-menu {
  padding: 0px;
  width: 0px;
  height: 0px;
  background-color: var(--vscode-editor-background) !important;
  transition: width 0.2s linear;
  z-index: 10;
}

#side-menu-container.active #side-menu {
  width: 500px;
  height: 100vh;
  padding: 10px 10px;
}

#side-menu-container.active #side-menu-backdrop {
  width: 100vw;
  height: 100vh;
}

.active {
  position: fixed;
  width: 100vw;
  height: 100vh;
}

i:hover {
  cursor: pointer;
  color: var(--vscode-button-foreground);
}
</style>
