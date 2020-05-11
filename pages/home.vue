<template>
  <v-content>
    <v-overlay class="fill-height" :value="isLoading">
      <loading v-if="isLoading" />
    </v-overlay>
    <v-layout v-show="!isLoading">
      <v-flex>
        <v-carousel
          style="margin-top: -100px"
          height="250px"
          cycle
          hide-delimiter-background
          show-arrows-on-hover
        >
          <v-carousel-item v-for="(slide, i) of featured" :key="i">
            <div style="text-align: center" :class="isMobile ? 'carousel-mobile' : 'carousel'">
              <v-img v-show="isMobile" @click="viewFeature(slide)" :src="slide.featured_image"></v-img>
              <img v-show="!isMobile" @click="viewFeature(slide)" :src="slide.featured_image" />
            </div>
            <!-- <v-row class="fill-height" align="center" justify="center">
            </v-row>-->
          </v-carousel-item>
        </v-carousel>
        <v-container>
          <v-row no-gutters>
            <v-col>
              <v-card class="pa-2" outlined tile>
                <h3>Últimas Atualizações</h3>
                <v-list subheader>
                  <v-subheader>Enjoy</v-subheader>
                  <v-row
                    class="mb-6"
                    no-gutters
                    style="margin-bottom: 15px"
                    v-for="(item, i) in releases"
                    :key="i"
                  >
                    <v-col sm="5" md="8">
                      <div>
                        <span class="font-weight-bold">{{item.name}}</span>
                      </div>
                      <img
                        @click="goToList(item)"
                        style="height: 300px;width: 255px"
                        :src="item.image"
                      />
                    </v-col>

                    <v-container>
                      <div
                        style="margin: 2px;margin-top: 5px;display: inline-block"
                        v-for="(cap, i) in item.chapters"
                        :key="i"
                      >
                        <!-- <span v-if="i < 3">{{i + 1 + "Eu"}}</span> -->
                        <v-btn
                          @click="getRelease(item, cap)"
                          style="margin-bottom: 5px"
                          v-if="i < 6"
                        >
                          <span style="font-size:15pt" class="font-weight-bold">{{cap.number}}</span>
                        </v-btn>
                      </div>
                    </v-container>
                    <!-- <v-col sm="5" offset-sm="2" md="4" offset-md="0">
                     
                    </v-col>-->
                    <!-- <div v-for="(cap, i) in item.chapters" :key="i">
                          <div class="text-center">
                            <v-btn v-if="i < 2">{{cap.number}}</v-btn>
                          </div>
                    </div>-->
                  </v-row>
                </v-list>
              </v-card>
            </v-col>
            <v-col order="1">
              <v-card class="pa-2" outlined tile>Second, but last</v-card>
            </v-col>
            <v-col order="12">
              <v-card class="pa-2" outlined tile>
                <h3>Recomendado</h3>
                <v-subheader v-if="!comics || !comics.length">Sem Recomendações no Momento</v-subheader>
                <v-list
                  v-if="comics && comics.length > 0 || comics.image"
                  :style="!isMobile ? 'text-align: center' : ''"
                  three-line
                >
                  <v-subheader>Enjoy</v-subheader>
                  <template v-for="(item, index) in comics">
                    <div :key="item.name">
                      <span class="font-weight-bold">{{item.name}}</span>
                    </div>

                    <!-- <v-divider :key="index" inset></v-divider> -->

                    <v-list-item @click="goToList(item)" style="margin-bottom: 15px" :key="index">
                      <img :class="isMobile ? 'favourites-mobile' : 'favourites'" :src="item.image" />

                      <v-list-item-content>
                        <v-list-item-title v-html="item.title"></v-list-item-title>
                        <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-flex>
    </v-layout>
  </v-content>
</template>
<script>
import Loading from "~/components/Loading";
import cloneDeep from "lodash/cloneDeep";
import constants from "../shared/constants";

export default {
  components: { Loading },
  data() {
    return {
      featured: [],
      favorites: [],
      releases: [],
      base_img: constants.BASE_IMG,
      isLoading: false
    };
  },
  mounted() {
    // this.isLoading = true;
    this.getFeatured();
    this.getReleases();
    this.listFavorites();
  },
  watch: {
    comics(debug) {
      console.log("comic atual", debug);
    }
  },
  computed: {
    comics() {
      return this.$store.state.comics;
    },
    isMobile() {
      return this.$store.state.isMobile;
    },
    comicCloning() {
      return cloneDeep(this.$store.state.comics);
    }
  },
  methods: {
    goToList(item) {
      this.$store.commit("LIST_COMIC", item);
      this.$router.push("list");
    },
    async getFeatured() {
      let res = await this.$axios
        .get("/home/getFeaturedSeries.json")
        .catch(err => err);
      this.featured = res.data.featured;
    },
    viewFeature(value) {
      console.log(value, "here");
    },
    async getReleases(page = 1) {
      let res = await this.$axios
        .get(`/home/releases?page=${page}`)
        .catch(err => err);
      this.releases = res.data.releases;
    },
    async listFavorites() {
      let arrayIds = this.$store.state.arrayIds;
      if (!arrayIds.length) {
        return;
      }
      this.isLoading = true;
      let res = await this.$axios
        .get(`/all/chapters_list.json?page=1&id_serie=${arrayIds[0]}`)
        .catch(err => {
          this.isLoading = false;
          return err.response;
        });
      if (res.status === 200) {
        this.$store.commit("SET_COMIC", res.data.chapters[0]);
        this.$store.commit("REMOVE_ID", arrayIds[0]);
        return arrayIds.length > 0
          ? this.listFavorites()
          : this.getCoverComic();
      }
      res.status !== 200 ? this.getCoverComic() : "";
    },
    async getCoverComic() {
      if (!this.comics.length) {
        console.log("parou aqui ?");
        return (this.isLoading = false);
      }
      let comic = this.comicCloning;
      console.log("o que temos no momento", comic);
      let rgx = /\s/g;
      let name = comic[0].name;
      rgx.test(name) ? (name = comic[0].name.replace(rgx, "-")) : "";
      let findLast = name.substr(name.length - 1);
      findLast === "-" ? (name = name.slice(0, -1)) : "";

      let response = await this.$axios
        .get(`/api/manga/${name.toLowerCase()}/${comic[0].id_serie}`)
        .catch(err => {
          this.isLoading = false;
          return err.response;
        });
      console.log("response", response);
      if (response.status === 200) {
        let data = JSON.stringify(response.data);
        let pathImg = this.searchHash(data);
        this.$store.commit("IMG_COMIC", {
          pathImg: pathImg,
          id: comic[0].id_serie
        });
        comic.shift();
        return comic.length > 0
          ? this.getCoverComic()
          : (this.isLoading = false);
      }
    },
    searchHash(data) {
      let search_01 = data.search("covers/");
      let str = data.substr(search_01);
      let search_02 = str.search("/external");
      let search_condition = false;
      if (search_02 > 50) {
        search_condition = true;
        search_02 = str.search("/capa");
      }
      let anotherResult = data.substr(search_01, search_02);
      let hashLegacy = anotherResult.split("covers/")[1];
      let extension = "";
      search_condition
        ? (extension = "/capa.jpg")
        : (extension = "/external_cover.jpg");
      return this.base_img + hashLegacy + extension;
    },
    getRelease(obj, chapter) {
      let base = chapter.url;
      let result_1 = base.substr(1);
      let root_2 = result_1.search("/");
      /* a barra nao conta na busca, retorna uma posiçao antes dela */
      let result_2 = result_1.substr(root_2 + 1);
      let root_3 = result_2.search("/");
      let result_3 = result_2.substr(root_3 + 1);
      let final_root = result_3.search("/");
      let id_release = result_3.substr(result_3, final_root);
      this.isLoading = true;
      let header = this.$axios.get(`/api/${chapter.url}`).catch(err => {
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
        this.$store.commit("SET_RELEASE", id_release);
        this.$store.commit("INFO_CHAPTER", {
          name: obj.name,
          number: chapter.number
        });
        this.$router.push("viewer");
      });
    }
    // async testeSearch() {
    //   let formData = new FormData();
    //   formData.append("search", "Solo");
    //   let res = await this.$axios.post("/search", formData).catch(err => err);
    //   console.log(res, "response");
    // }
  }
};
</script>
<style>
.carousel-mobile {
  max-width: auto;
  /* Center and scale the image nicely */
  background-repeat: no-repeat;
  background-size: cover;
  height: 200px;
}
.carousel {
  max-width: auto;
  /* Center and scale the image nicely */
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
}
.favourites {
  height: 280px;
  width: 240px;
  margin-left: 10%;
}
.favourites-mobile {
  height: 280px;
  width: 240px;
}
</style>
