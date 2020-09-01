
import cloneDeep from "lodash/cloneDeep";

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
    listCurrent: {},
    chaptersList: {},
    images: [],
    favourites: []
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
            image: comic.image || comic.featured_image || comic.cover
        }
    },
    SET_LOADING(state, value) {
        state.stateLoading = value
    },
    ALL_LIST(state, value) {
        state.listCurrent = value
    },
    CHAPTERS_LIST(state, value) {
        state.chaptersList = value
    },
    IMGS_LIST(state, value) {
        state.images = value
    },
    ADD_FAV_FAVOURITES(state, comic) {
        if (comic) {
            let favourite = {
                name: comic.name || comic.series_name,
                id_serie: comic.id_serie,
                image: comic.image || comic.featured_image || comic.cover
            }
            state.favourites.push(favourite)
        }
    },
    RM_FAV_FAVOURITES(state, id_serie) {
        let comicIndex = null;
        state.favourites.map((comic, index) => {
            if (comic.id_serie === id_serie) {
                comicIndex = index;
            }
        });
        state.favourites.splice(comicIndex, 1);
    },

}

export const actions = {
    async showRelease({ commit }, payload) {
        let chapter = payload.chapter;
        payload.link ? chapter['url'] = payload.link : chapter['url'] = chapter.url
        let base = chapter.url;
        let startSearch = base.search('/online/')
        let paramStr = base.substr(startSearch + 1).replace('online/', '')
        let final = paramStr.search('/')
        let value = paramStr.substr(paramStr, final)
        let id_release = value;
        commit("SET_LOADING", false)
        let response = await this.$axios.get(`/api/${chapter.url}`).catch(err => {
            commit("SET_LOADING", true)
            return err.response;
        });
        if (response.status !== 200) return;
        let link = JSON.stringify(response.data);
        let initialSearch = link.search("&token=");
        let result = link.substr(initialSearch);
        let finalSearch = result.search("&id_release");
        let resultHash = link.substr(initialSearch, finalSearch);
        let hashRelease = resultHash.split("&token=")[1];
        commit("SET_HASH", hashRelease);
        commit("SET_RELEASE", id_release);
        commit("SET_LOADING", true)
        commit("INFO_CHAPTER", {
            name: payload.obj ? payload.obj.name : chapter.name,
            number: chapter.number
        });
    },
    async getAllChapters({ state, dispatch, commit }, payload) {
        let page = state.listCurrent.page;
        payload.indexChapter === 0 ? page-- : page++
        commit("SET_LOADING", false)
        let response = await this.$axios
            .get(
                `/all/chapters_list.json?page=${page}&id_serie=${payload.chapter.id_serie}`
            )
            .catch(err => {
                commit("SET_LOADING", true)
                return err.response;
            });
        if (response.status === 200) {
            commit("SET_LOADING", true)
            commit("ALL_LIST", {
                page: page,
                all: response.data.chapters
            });
            dispatch('stateArray', { infoChapter: payload, all: response.data.chapters })
        }
    },
    stateArray({ commit, dispatch }, payload) {
        let index;
        payload.infoChapter.indexChapter === 0 ? index = 29 : index = 0
        const next = this.$method.arrayState(
            payload.all,
            index
        );
        const previous = cloneDeep(next);
        /* logica invertida devido ao orderBy, mantendo a funcao arrayState na forma correta para uso futuro*/
        let nextChapter = next.prev();
        let prevChapter = previous.next();

        let chaptersList = {
            current: payload.infoChapter,
            prev: {
                chapter: prevChapter.obj,
                link: this.$method.releaseTransform(prevChapter.obj.releases).link,
                indexChapter: prevChapter.index
            },
            next: {
                chapter: nextChapter.obj,
                link: this.$method.releaseTransform(nextChapter.obj.releases).link,
                indexChapter: nextChapter.index
            }
        };
        commit("CHAPTERS_LIST", chaptersList);
        dispatch("showRelease", {
            chapter: index === 0 ? chaptersList.next.chapter : chaptersList.prev.chapter,
            link: index === 0 ? chaptersList.next.link : chaptersList.prev.link
        });
    }
}
