<template>
  <v-content>
    <v-overlay class="fill-height" :value="isLoading || !stateLoading">
      <loading v-if="isLoading || !stateLoading" />
    </v-overlay>
    <v-container v-show="allChapters && allChapters.length > 0">
      <v-card max-width="1200" class="mx-auto" style="margin-top: -90px">
        <v-card-text>
          <v-list two-line subheader>
            <span
              style="font-size: 14pt;color: color: rgba(255, 255, 255, 0.7);"
              inset
            >{{infoComic.name}}</span>

            <v-list-item
              v-for="(item, i) in allChapters"
              @click="getRelease(item.releases, {name: item.name, number: item.number, index: i})"
              :key="i"
            >
              <v-list-item-avatar size="80">
                <v-img :src="infoComic.image"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <span :style="isMobile ? 'font-size: 13pt' : 'font-size: 16pt'">
                  {{'Capítulo ' + item.number}}
                  <v-chip
                    v-if="moment(item.date_created).isBetween(dateYesterday, date)"
                    class="ma-2"
                    color="red"
                    text-color="white"
                  >
                    <span class="font-weight-bold">Novo</span>
                    <v-icon size="20" style="margin-top: -3px">mdi-star</v-icon>
                  </v-chip>
                </span>
                <span class="hint-text">{{'Disponível em: ' + $mask.dateFormat(item.date_created)}}</span>
              </v-list-item-content>

              <v-list-item-action
                @click="getRelease(item.releases, {name: item.name, number: item.number})"
              >
                <v-btn icon>
                  <v-icon>fas fa-book-reader</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
      <div class="text-center">
        <v-pagination
          v-model="page"
          :length="!endAll ? page + 1 : page "
          prev-icon="mdi-menu-left"
          next-icon="mdi-menu-right"
        ></v-pagination>
      </div>
    </v-container>
  </v-content>
</template>

<script>
import Loading from "../components/Loading";
import cloneDeep from "lodash/cloneDeep";
import VueResource from "vue-resource";
import moment from "moment";
import Vue from "vue";
Vue.use(VueResource);

export default {
  scrollToTop: true,
  components: { Loading },
  data: () => ({
    id_serie: "2412",
    page: 1,
    isLoading: false,
    allChapters: [],
    title: "",
    endAll: false,
    moment: moment
  }),
  mounted() {
    this.isLoading = true;
    setTimeout(() => {
      this.getAllChapters();
    }, 1500);
  },
  watch: {
    infoComic(comic) {
      this.isLoading = true;
      this.getAllChapters();
    },
    page(index) {
      this.isLoading = true;
      this.getAllChapters(index);
    },
    stateLoading(load) {
      this.$router.push("viewer");
    },
    allChapters(chapter) {
      this.endAll = false;
      chapter.forEach(res => {
        if (["0", "1"].includes(res.number)) {
          this.endAll = true;
        }
      });
    }
  },
  computed: {
    infoComic() {
      return this.$store.state.infoComic;
    },
    isMobile() {
      return this.$store.state.isMobile;
    },
    stateLoading() {
      return this.$store.state.stateLoading;
    },
    date() {
      return moment().toString();
    },
    dateYesterday() {
      return moment()
        .subtract(1, "days")
        .toString();
    }
  },
  methods: {
    getAllChapters(page = 1) {
      Vue.http
        .get(
          `/all/chapters_list.json?page=${page}&id_serie=${this.infoComic.id_serie}`
        )
        .then(
          res => {
            res.status !== 200 ? this.$router.push("home") : "";
            if (res.body) {
              this.allChapters = res.body.chapters;
              let listCurrent = {
                page: page,
                all: this.allChapters
              };
              this.$store.commit("ALL_LIST", listCurrent);
              this.title = this.allChapters.find(res => res).name;
              this.isLoading = false;
            }
          },
          err => {
            this.$router.push("home");
            return err;
          }
        );
    },
    getRelease(obj, infoChapter) {
      this.stateArray(infoChapter);
      let release = Object.entries(obj).find(res => res)[1];
      this.$store.dispatch("showRelease", {
        chapter: infoChapter,
        link: release.link
      });
    },
    stateArray(infoChapter) {
      const next = this.$method.arrayState(this.allChapters, infoChapter.index);
      const previous = cloneDeep(next);
      /* logica invertida devido ao orderBy, mantendo a funcao arrayState na forma correta para uso futuro*/
      let nextChapter = next.prev();
      let prevChapter = previous.next();
      let chaptersList = {
        current: infoChapter,
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
      this.$store.commit("CHAPTERS_LIST", chaptersList);
    }
  }
};
</script>

<style>
.hint-text {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.2;
  font-size: 0.995rem;
}
</style>
