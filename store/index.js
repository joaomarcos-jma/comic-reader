export const state = () => ({
    id_release: '',
    arrayIds: ["7702", "2412"],
    comics: [],
    hash_release: '',
    infoChapter: {},
    imgComics: [],
    isMobile: null
})

export const mutations = {
    SET_RELEASE(state, payload) {
        state.id_release = payload
    },
    SET_COMIC(state, obj) {
        state.comics.push(obj)
    },
    IMG_COMIC(state, value) {
        let indexId = null;
        state.comics.forEach((res, index) => {
            if (res.id_serie === value.id) {
                indexId = index
            }
        })
        state.comics[indexId].img = value
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
    },
    SET_MOBILE(state, value) {
        state.isMobile = value
    }
}

export const actions = {}
