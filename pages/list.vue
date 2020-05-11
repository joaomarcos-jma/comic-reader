<template>
  <v-content>
    <v-overlay class="fill-height" :value="isLoading">
      <loading v-if="isLoading" />
    </v-overlay>
    <v-container>
      <v-card
        v-show="allChapters.length > 0"
        max-width="1200"
        class="mx-auto"
        style="margin-top: -90px"
      >
        <v-card-text>
          <v-list two-line subheader>
            <span style="font-size: 14pt;color: color: rgba(255, 255, 255, 0.7);" inset>{{title}}</span>

            <v-list-item v-for="(item, i) in allChapters" @click="getRelease(item.releases, {name: item.name, number: item.number})" :key="i">
              <v-list-item-avatar size="80">
                <v-img :src="require('../static/logos/tdg.png')"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <span :style="isMobile ? 'font-size: 13pt' : 'font-size: 16pt'">{{'Capítulo ' + item.number}}</span>
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
    }
  },
  methods: {
    async getAllChapters(page = 1) {
      let response = await this.$axios
        .get(`/all/chapters_list.json?page=${page}&id_serie=${this.id_serie}`)
        .catch(err => {
          this.isLoading = false;
          console.error(err.response);
          return err;
        });
      console.log("response", response);
      if (response.data) {
        this.allChapters = response.data.chapters;
        this.title = this.allChapters.find(res => res).name;
        this.isLoading = false;
      }
    },
    getRelease(obj, infoChapter) {
      let release = Object.entries(obj).find(res => res)[1];
      console.log("1 link", release, "infoChapter", infoChapter);
      this.isLoading = true;
      let header = this.$axios.get(`/api/${release.link}`).catch(err => {
        this.isLoading = false;
        return err;
      });
      header.then(res => {
        let link = JSON.stringify(res.headers.link);
        let initialSearch = link.search("&token=");
        let result = link.substr(initialSearch);
        let finalSearch = result.search("&id_release");
        let resultHash = link.substr(initialSearch, finalSearch);
        let hashRelease = resultHash.split("&token=")[1];
        this.$store.commit("SET_HASH", hashRelease);
        this.$store.commit("SET_RELEASE", release.id_release);
        this.$store.commit("INFO_CHAPTER", infoChapter);
        this.$router.push("viewer");
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
