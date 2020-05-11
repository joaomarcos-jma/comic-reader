<template>
  <v-content style="margin-top: -10px">
    <v-layout class="text-center">
      <v-overlay class="fill-height" :value="isLoading">
        <loading v-if="isLoading" />
      </v-overlay>
      <v-flex v-show="loadFiles.length > 0" :class="!isMobile ? 'load-img' : 'load-img-mobile'">
        <div v-for="(src, i) in loadFiles" :src="src" :key="i" class="images" v-viewer>
          <img class="load-img" :src="src" />
        </div>
      </v-flex>
    </v-layout>

    <v-footer color="#121212" v-show="render" :class="isMobile ? 'load-img' : 'text-center'">
      <v-card class="flex" flat tile>
        <v-card-text>
          <v-list class="teal white--text text-center">
            <v-list-item>
              <v-list-item-content>
                <div style="text-align: left;margin-left: 30px">
                  <v-btn @click="goBack()" text style="margin-right: 30px" dark>
                    <v-icon>fas fa-arrow-left</v-icon>
                    <span style="font-size: 14pt">Voltar</span>
                  </v-btn>
                </div>
              </v-list-item-content>

              <v-spacer></v-spacer>

              <v-list-item-icon style="margin-right: 5px" @click="teste('anterior')">
                <v-btn outlined>
                  <v-icon>fas fa-step-backward</v-icon>Anterior
                </v-btn>
              </v-list-item-icon>
              <v-list-item-icon
                @click="teste('proximo')"
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
              >{{infoChapter.name + ' - Capítulo ' + infoChapter.number}}</strong>
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
import Vue from "vue";
Vue.use(Viewer);
export default {
  components: { Loading },
  data: () => ({
    images: [],
    isLoading: false,
    render: false,
    icons: ["mdi-github"],
    linkOwner: "https://github.com/joaomarcos-jma"
  }),
  mounted() {
    this.isLoading = true;
    this.render = false;
    if (this.hashRelease) {
      this.getScan();
    }
  },
  watch: {
    loadFiles(value) {
      return value
        ? setTimeout(() => {
            this.render = true;
          }, 300)
        : "";
    }
  },
  methods: {
    async getScan() {
      let res = await this.$axios
        .get(`/scan/${this.release}.json?key=${this.hashRelease}`)
        .catch(err => {
          this.isLoading = false;
          return err;
        });
      console.log("response", res);
      if (res.data) {
        this.images = res.data.images;
        this.isLoading = false;
      }
      return res;
    },
    goBack() {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push("home");
    },
    teste(value) {
      console.log(value);
    }
  },
  computed: {
    loadFiles() {
      console.log("here", this.images);
      return this.images;
    },
    release() {
      return this.$store.state.id_release;
    },
    hashRelease() {
      return this.$store.state.hash_release;
    },
    infoChapter() {
      return this.$store.state.infoChapter;
    },
    isMobile() {
      return this.$store.state.isMobile;
    }
  }
};
</script>
<style>
.load-img {
  width: 1000px;
  max-width: auto;
}

.load-img-mobile {
  width: 360px;
  max-width: auto;
}
</style>
