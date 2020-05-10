export const state = () => ({
    id_release: '',
    arrayIds: ["7702", "2412"],
    favourites: [],
    hash_release: '',
    infoChapter: {}
})

export const mutations = {
    SET_RELEASE(state, payload) {
        state.id_release = payload
    },
    SET_COMIC(state, obj) {
        state.favourites.push(obj)
    },
    REMOVE_ID(state, id) {
        let indexId = null;
        state.arrayIds.map((res, index) => {
            if (res.id === id) {
                indexId = index;
            }
        });
        state.arrayIds.splice(indexId, 1);
    },
    SET_HASH(state, payload) {
        state.hash_release = payload
    },
    INFO_CHAPTER(state, payload) {
        state.infoChapter = payload
    }
}

export const actions = {}
