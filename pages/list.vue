<template>
  <v-content>
    <v-overlay class="fill-height" :value="isLoading || !stateLoading">
      <loading v-if="isLoading || !stateLoading" />
    </v-overlay>
    <v-container>
      <v-card
        v-show="allChapters && allChapters.length > 0"
        max-width="1200"
        class="mx-auto"
        style="margin-top: -90px"
      >
        <v-card-text>
          <v-list two-line subheader>
            <span
              style="font-size: 14pt;color: color: rgba(255, 255, 255, 0.7);"
              inset
            >{{infoComic.name}}</span>

            <v-list-item
              v-for="(item, i) in allChapters"
              @click="getRelease(item.releases, {name: item.name, number: item.number})"
              :key="i"
            >
              <v-list-item-avatar size="80">
                <v-img :src="infoComic.image"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <span
                  :style="isMobile ? 'font-size: 13pt' : 'font-size: 16pt'"
                >{{'Capítulo ' + item.number}}</span>
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
    </v-container>
  </v-content>
</template>

<script>
import Loading from "../components/Loading";

export default {
  components: { Loading },
  data: () => ({
    id_serie: "2412",
    page: 1,
    isLoading: false,
    allChapters: [],
    title: "",
    items: [
      {
        icon: "folder",
        iconClass: "grey lighten-1 white--text",
        title: "Photos",
        subtitle: "Jan 9, 2014"
      },
      {
        icon: "folder",
        iconClass: "grey lighten-1 white--text",
        title: "Recipes",
        subtitle: "Jan 17, 2014"
      },
      {
        icon: "folder",
        iconClass: "grey lighten-1 white--text",
        title: "Work",
        subtitle: "Jan 28, 2014"
      }
    ]
  }),
  mounted() {
    this.isLoading = true;
    setTimeout(() => {
      this.getAllChapters();
    }, 1500);
  },
  watch: {
    page(index) {
      this.getAllChapters(index);
    },
    stateLoading(load) {
      this.$router.push("viewer");
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
    }
  },
  methods: {
    async getAllChapters(page = 1) {
      let response = await this.$axios
        .get(
          `/all/chapters_list.json?page=${page}&id_serie=${this.infoComic.id_serie}`
        )
        .catch(err => {
          this.isLoading = false;
          return err.response;
        });
      response.status !== 200 ? this.$router.push("home") : "";
      if (response.data) {
        this.allChapters = response.data.chapters;
        this.title = this.allChapters.find(res => res).name;
        this.isLoading = false;
      }
    },
    getRelease(obj, infoChapter) {
      let release = Object.entries(obj).find(res => res)[1];
      this.$store.dispatch("showRelease", {
        obj: obj,
        chapter: infoChapter,
        link: release.link
      });
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
