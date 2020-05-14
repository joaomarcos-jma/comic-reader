<template>
  <v-content style="margin-top: -10px">
    <v-layout class="text-center">
      <v-overlay class="fill-height" :value="isLoading || !stateLoading">
        <loading v-if="isLoading || !stateLoading" />
      </v-overlay>
      <v-flex
        v-show="loadFiles.length > 0 && !isLoading"
        :class="!isMobile ? 'load-img' : 'load-img-mobile'"
      >
        <div v-for="(src, i) in loadFiles" :src="src" :key="i" class="images" v-viewer>
          <img class="load-img" :src="src" />
        </div>
      </v-flex>
    </v-layout>

    <v-footer
      color="#121212"
      v-show="loadFiles.length > 0 && !isLoading"
      :class="isMobile ? 'load-img' : 'text-center'"
    >
      <v-card class="flex" flat tile>
        <v-card-text>
          <v-list class="teal white--text text-center">
            <v-list-item>
              <v-list-item-content>
                <div style="text-align: left;margin-left: 30px">
                  <v-btn @click="goBack()" text style="margin-right: 30px" dark>
                    <v-icon>fas fa-arrow-left</v-icon>
                  </v-btn>
                </div>
              </v-list-item-content>

              <!-- <v-spacer></v-spacer> -->

              <v-list-item-icon
                v-if="visiblePrev"
                style="margin-right: 5px"
                @click="stateArray('prev')"
              >
                <v-btn outlined>
                  <v-icon>fas fa-step-backward</v-icon>Anterior
                </v-btn>
              </v-list-item-icon>
              <v-list-item-icon
                @click="stateArray('next')"
                v-if="visibleNext"
                class="ml-0"
                :class="{ 'mr-3': $vuetify.breakpoint.mdAndUp }"
              >
                <v-btn outlined>
                  Próximo
                  <v-icon>fas fa-step-forward</v-icon>
                </v-btn>
              </v-list-item-icon>
              <v-spacer></v-spacer>
              <strong
                style="font-size: 14pt"
                class="subheading"
              >{{$method.trimString(currentChapter.name, 25) + ' - Capítulo ' + currentChapter.number}}</strong>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-text class="py-2 white--text text-center">
          <v-btn
            :href="linkOwner"
            target="_blank"
            v-for="icon in icons"
            :key="icon"
            class="mx-4"
            dark
            icon
          >
            <v-icon size="24px">{{ icon }}</v-icon>
          </v-btn>
          {{ new Date().getFullYear() }} —
          <strong>Comic Reader</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-content>
</template>
<script>
import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer";
import Loading from "../components/Loading";
import cloneDeep from "lodash/cloneDeep";
import Vue from "vue";
Vue.use(Viewer);
export default {
  scrollToTop: true,
  components: { Loading },
  data: () => ({
    images: [],
    isLoading: false,
    render: false,
    visiblePrev: true,
    visibleNext: true,
    icons: ["mdi-github"],
    linkOwner: "https://github.com/joaomarcos-jma"
  }),
  mounted() {
    this.isLoading = true;
    this.render = false;
    if (this.hashRelease) {
      this.getScan();
      this.render = false;
      if (
        [this.prev.chapter.number].includes(this.currentChapter.number) &&
        ["0", "1"].includes(this.currentChapter.number)
      ) {
        this.visiblePrev = false;
      }
      if (
        [1].includes(this.listCurrent.page) &&
        [this.next.chapter.number].includes(this.currentChapter.number)
      ) {
        this.visibleNext = false;
      }
    }
  },
  watch: {
    hashRelease(value) {
      this.visiblePrev = true;
      this.visibleNext = true;
      this.getScan();
      setTimeout(() => {
        this.render = true;
      }, 1000);
      if (
        [this.prev.chapter.number].includes(this.currentChapter.number) &&
        ["0", "1"].includes(this.currentChapter.number)
      ) {
        this.visiblePrev = false;
      }
      if (
        [1].includes(this.listCurrent.page) &&
        [this.next.chapter.number].includes(this.currentChapter.number)
      ) {
        this.visibleNext = false;
      }
    }
  },
  methods: {
    async getScan() {
      let res = await this.$axios
        .get(`/scan/${this.release}.json?key=${this.hashRelease}`)
        .catch(err => {
          this.isLoading = false;
          return err.response;
        });
      if (res.status !== 200) {
        return this.goBack();
      }
      this.images = res.data.images;
      this.$store.commit("IMGS_LIST", res.data.images);
      this.isLoading = false;
    },
    goBack() {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push("home");
    },
    stateArray(action) {
      let infoChapter;
      ["next"].includes(action)
        ? (infoChapter = this.next)
        : (infoChapter = this.prev);
      this.isLoading = true;
      this.render = false;
      this.$store.dispatch("showRelease", {
        chapter: infoChapter.chapter,
        link: infoChapter.link
      });
      let chaptersList = {
        current: infoChapter
      };
      if (
        [0].includes(infoChapter.indexChapter) &&
        this.listCurrent.page === 1
      ) {
        this.chaptersList.current.chapter
          ? (chaptersList["prev"] = this.chaptersList.current)
          : (chaptersList["prev"] = {
              chapter: this.chaptersList.current,
              link: this.chaptersList.current.url,
              indexChapter: this.chaptersList.current.index
            });
        chaptersList["next"] = this.chaptersList.next;
        this.$store.commit("CHAPTERS_LIST", chaptersList);
        return;
      }
      if (
        ([0].includes(infoChapter.indexChapter) &&
          [1].includes(this.prev.indexChapter)) ||
        (["prev"].includes(action) &&
          this.next &&
          [28].includes(this.next.indexChapter) &&
          [29].includes(this.prev.indexChapter))
      ) {
        this.$store.dispatch("getAllChapters", infoChapter);
        return;
      }
      const next = this.$method.arrayState(
        this.listCurrent.all,
        infoChapter.indexChapter
      );
      const previous = cloneDeep(next);
      /* logica invertida devido ao orderBy, mantendo a funcao arrayState na forma correta para uso futuro*/
      let nextChapter = next.prev();
      let prevChapter = previous.next();

      (chaptersList["prev"] = {
        chapter: prevChapter.obj,
        link: this.$method.releaseTransform(prevChapter.obj.releases).link,
        indexChapter: prevChapter.index
      }),
        (chaptersList["next"] = {
          chapter: nextChapter.obj,
          link: this.$method.releaseTransform(nextChapter.obj.releases).link,
          indexChapter: nextChapter.index
        });
      this.$store.commit("CHAPTERS_LIST", chaptersList);
    }
  },
  computed: {
    loadFiles() {
      return this.$store.state.images;
    },
    release() {
      return this.$store.state.id_release;
    },
    hashRelease() {
      return this.$store.state.hash_release;
    },
    currentChapter() {
      return this.$store.state.infoChapter;
    },
    chaptersList() {
      return this.$store.state.chaptersList;
    },
    isMobile() {
      return this.$store.state.isMobile;
    },
    next() {
      return this.$store.state.chaptersList.next;
    },
    prev() {
      return this.$store.state.chaptersList.prev;
    },
    listCurrent() {
      return this.$store.state.listCurrent;
    },
    stateLoading() {
      return this.$store.state.stateLoading;
    }
  }
};
</script>
<style>
.load-img {
  width: 800px;
  max-width: auto;
}

.load-img-mobile {
  width: 360px;
  max-width: auto;
}
</style>
