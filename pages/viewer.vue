<template>
  <v-content style="margin-top: -10px">
    <v-layout>
      <v-overlay class="fill-height" :value="isLoading">
        <loading v-if="isLoading" />
      </v-overlay>
      <!-- <v-content class="fill-height">
        <div style="text-align: right">
          <v-btn @click="goBack()" icon style="margin-right: 30px" dark>
            <v-icon>fas fa-arrow-left</v-icon>
            <span>Voltar</span>
          </v-btn>
          <h4>{{'Capítulo ' + infoChapter.number}}</h4>
        </div>
      </v-content> -->
      <v-flex v-show="loadFiles.length > 0" class="text-center">
        <div v-for="(src, i) in loadFiles" :src="src" :key="i" class="images" v-viewer>
          <img style="width: 800px" :src="src" />
        </div>
      </v-flex>
    </v-layout>
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
    isLoading: false
  }),
  mounted() {
    this.isLoading = true;
    if (this.hashRelease) {
      this.getScan();
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
    }
  }
};
</script>
