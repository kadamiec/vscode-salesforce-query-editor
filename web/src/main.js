import Vue from 'vue';
import App from './App';
import router from './router';
import soqlEditor from './utils/soqlEditor/index';
import Vuex from 'vuex';
import { store } from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import Clipboard from 'v-clipboard';
import VueShortkey from 'vue-shortkey';
import VueHighlightJS from 'vue-highlightjs';
import 'highlight.js/styles/vs2015.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import VueConfirmDialog from 'vue-confirm-dialog';
import JsonViewer from 'vue-json-viewer';
import VueVirtualScroller from 'vue-virtual-scroller'

soqlEditor.activate();

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueHighlightJS);
Vue.use(Clipboard);
Vue.use(Vuex);
Vue.use(VueConfirmDialog);
Vue.use(VueShortkey);
Vue.use(JsonViewer);
Vue.use(VueVirtualScroller);

Vue.component('vue-confirm-dialog', VueConfirmDialog.default)

/* eslint-disable no-new */
// @ts-ignore
new Vue({
    el: '#app',
    router,
    components: {
        App
    },
    template: '<App/>',
    store
});
