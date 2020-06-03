<template>
  <v-lazy ssr-only>
    <v-layout>
      <v-container>
        <v-row class="text-center">
          <v-col :order="i" v-for="(fav, i) in allFavourites" :key="i">
            <!-- <div class="text-right" style="position: relative;">
            <v-btn class="ma-2" text icon @click="removeFavourite(fav)">
              <v-icon color="orange" size="35">fas fa-bookmark</v-icon>
            </v-btn>
            </div>-->
            <v-hover v-slot:default="{ hover }">
              <v-img @click="goToList(fav)" class="favourites" :src="fav.image">
                <v-expand-transition>
                  <v-fade-transition>
                    <v-overlay v-if="hover" absolute color="#036358">
                      <v-card-title class="white--text pl-12 pt-12">{{fav.name}}</v-card-title>
                    </v-overlay>
                  </v-fade-transition>
                </v-expand-transition>
              </v-img>
            </v-hover>
            <!-- <v-img :src="fav.image" height="300px" dark>
              <v-row class="fill-height">
                <v-card-title>
                  <v-btn dark icon>
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn dark icon class="mr-4">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn dark icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </v-card-title>
                <v-spacer></v-spacer>
                <v-card-title class="white--text pl-12 pt-12">
                  <div class="display-1 pl-12 pt-12">{{fav.name}}</div>
                </v-card-title>
              </v-row>
            </v-img>-->
          </v-col>
        </v-row>
      </v-container>
    </v-layout>
  </v-lazy>
</template>
<script>
export default {
  data: () => ({
    alignments: ["start", "center", "end"]
  }),
  computed: {
    allFavourites() {
      return this.$store.state.favourites;
    },
    isMobile() {
      return this.$store.state.isMobile;
    },
    cols() {
      const { lg, sm } = this.$vuetify.breakpoint;
      return lg ? [3, 9] : sm ? [9, 3] : [6, 6];
    }
  },
  methods: {
    goToList(fav) {
      this.$store.commit("LIST_COMIC", fav);
      this.$router.push("list");
    },
    removeFavourite(fav) {
      this.$store.commit("RM_FAV_FAVOURITES", fav.id_serie);
    }
  }
};
</script>

<style>
.favourites {
  height: 280px;
  width: 290px;
}
</style>