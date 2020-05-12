export const state = () => ({
    id_release: '',
    arrayIds: ["7702", "2412", "7475", "3364", "1772"],
    comics: [],
    hash_release: '',
    infoChapter: {},
    imgComics: [],
    isMobile: null,
    infoComic: {},
    stateLoading: true,
    images: []
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
        state.comics[indexId].image = value.pathImg
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
    },
    LIST_COMIC(state, comic) {
        state.infoComic = {
            name: comic.name || comic.series_name,
            id_serie: comic.id_serie,
            image: comic.image || comic.featured_image
        }
    },
    SET_LOADING(state, value) {
        state.stateLoading = value
    },
    LOAD_IMGS(state, value) {
        state.images.push(value)
    },
    CLEAR_IMGS(state) {
        while (state.images.length > 0) {
            state.images.pop();
        }
    }
}

export const actions = {
    async showRelease({ commit }, payload) {
        commit("CLEAR_IMGS")
        let chapter = payload.chapter;
        let obj = payload.obj;
        console.log("payload", payload)
        payload.link ? chapter['url'] = payload.link : ''
        let base = chapter.url;
        let result_1 = base.substr(1);
        let root_2 = result_1.search("/");
        /* a barra nao conta na busca, retorna uma posiçao antes dela */
        let result_2 = result_1.substr(root_2 + 1);
        let root_3 = result_2.search("/");
        let result_3 = result_2.substr(root_3 + 1);
        let final_root = result_3.search("/");
        let id_release = result_3.substr(result_3, final_root);
        commit("SET_LOADING", false)
        let response = await this.$axios.get(`/api/${chapter.url}`).catch(err => {
            commit("SET_LOADING", true)
            return err.response;
        });
        if (response.status !== 200) {
            return;
        }
        let link = JSON.stringify(response.headers.link);
        let initialSearch = link.search("&token=");
        let result = link.substr(initialSearch);
        let finalSearch = result.search("&id_release");
        let resultHash = link.substr(initialSearch, finalSearch);
        let hashRelease = resultHash.split("&token=")[1];
        console.log("hashRelease", hashRelease)
        console.log("id_release", id_release)
        commit("SET_HASH", hashRelease);
        commit("SET_RELEASE", id_release);
        commit("SET_LOADING", true)
        console.log("obj.name", obj.name, "payload", payload)
        commit("INFO_CHAPTER", {
            name: obj.name || chapter.name,
            number: chapter.number
        });
    }
}
