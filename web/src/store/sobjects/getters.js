export const getters = {
    getSObjectByName: (state) => (apiName) => {
        return state.sobjects[apiName.toLowerCase()];
    },
    referenceableObjects: (state) => {
        return Object.values(state.sobjects)
            .filter((object) => {
                return !object.customSetting;
            })
            .sort(function (a, b) {
                return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
            });
    },
    getSObjectFields: (state) => (apiName) => {
        if (state.sobjectsWithDetails[apiName.toLowerCase()]) {
            return state.sobjectsWithDetails[apiName.toLowerCase()].fields.sort((a, b) =>
                a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            );
        } else {
            return [];
        }
    }
};
