<template>
  <v-content>
    <v-layout>
      <v-flex>
        <v-carousel
          style="margin-top: -30px"
          height="250px"
          cycle
          hide-delimiter-background
          show-arrows-on-hover
        >
          <v-carousel-item v-for="(slide, i) of featured" :key="i">
            <div style="text-align: center" class="back-cover">
              <img @click="viewFeature(slide)" style="height: 250px;" :src="slide.featured_image" />
            </div>
            <!-- <v-row class="fill-height" align="center" justify="center">
            </v-row>-->
          </v-carousel-item>
        </v-carousel>
        <v-container>
          <v-row class="mb-6" no-gutters>
            <v-col sm="5" md="8">
              <v-card class="pa-2" outlined tile>
                <h3>Sugestoes de Leituras</h3>
                <v-list three-line>
                  <template v-for="(item, index) in items">
                    <v-subheader v-if="item.header" :key="item.header" v-text="item.header"></v-subheader>

                    <v-divider v-else-if="item.divider" :key="index" :inset="item.inset"></v-divider>

                    <v-list-item v-else :key="item.title">
                      <v-list-item-avatar>
                        <v-img :src="item.avatar"></v-img>
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title v-html="item.title"></v-list-item-title>
                        <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-list>
              </v-card>
            </v-col>
            <v-col sm="5" offset-sm="2" md="4" offset-md="0">
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
                      <img style="height: 180px;width: 180px" :src="item.image" />
                    </v-col>
                    <v-col sm="5" offset-sm="2" md="4" offset-md="0">
                      <!-- <div>
                        <span>teste</span>
                      </div>-->
                      <v-container>
                        <div
                          style="margin: 2px;margin-top: 13px;display: inline-block"
                          v-for="(cap, i) in item.chapters"
                          :key="i"
                        >
                          <!-- <span v-if="i < 3">{{i + 1 + "Eu"}}</span> -->
                          <v-btn style="margin-bottom: 5px" v-if="i < 4">{{cap.number}}</v-btn>
                        </div>
                      </v-container>
                    </v-col>
                    <!-- <div v-for="(cap, i) in item.chapters" :key="i">
                          <div class="text-center">
                            <v-btn v-if="i < 2">{{cap.number}}</v-btn>
                          </div>
                    </div>-->
                  </v-row>
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
export default {
  data() {
    return {
      featured: [],
      favorites: [],
      releases: [],
      isLoading: false,
      items: [
        { header: "Today" },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
          title: "Brunch this weekend?",
          subtitle:
            "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
        },
        { divider: true, inset: true },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
          title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
          subtitle:
            "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend."
        },
        { divider: true, inset: true },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
          title: "Oui oui",
          subtitle:
            "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?"
        },
        { divider: true, inset: true },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
          title: "Birthday gift",
          subtitle:
            "<span class='text--primary'>Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?"
        },
        { divider: true, inset: true },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
          title: "Recipe to try",
          subtitle:
            "<span class='text--primary'>Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos."
        }
      ]
    };
  },
  mounted() {
    this.getFeatured();
    this.getReleases();
    this.listFavorites();
  },
  watch: {
    comics(val) {
      console.log("Comic", val);
    }
  },
  computed: {
    comics() {
      return this.$store.state.favourites;
    }
  },
  methods: {
    async getFeatured() {
      let res = await this.$axios
        .get("/home/getFeaturedSeries.json")
        .catch(err => err);
      console.log(res, "feature");
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
          return err;
        });
      if (res.status === 200) {
        console.log("response", res, arrayIds);
        this.$store.commit("SET_COMIC", res.data.chapters[0]);
        this.$store.commit("REMOVE_ID", arrayIds[0]);
        console.log("response", res, arrayIds);
        return arrayIds.length > 0
          ? this.listFavorites()
          : (this.isLoading = false);
      }
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
.back-cover {
  height: 100%;
  max-width: auto;
  /* Center and scale the image nicely */
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
