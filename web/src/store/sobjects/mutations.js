import Vue from 'vue';

export const mutations = {
    setSObject(state, newSobject) {
        Vue.set(state.sobjectsWithDetails, newSobject.name.toLowerCase(), newSobject);
    },
    setSObjects(state, newSObjects) {
        state.sobjects = {};
        newSObjects.forEach((newSObject) => {
            Vue.set(state.sobjects, newSObject.name.toLowerCase(), newSObject)
        });
    },
    clearSObjectsDetails(state){
        state.sobjectsWithDetails = {};
    }
};
