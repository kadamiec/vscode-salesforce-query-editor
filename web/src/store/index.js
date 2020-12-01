import Vue from 'vue';
import Vuex from 'vuex';
import { sobjects } from './sobjects';

Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        sobjects
    }
});
