<template>
  <v-slide-x-reverse-transition mode="out-in">
    <v-autocomplete
      v-model="select"
      :loading="loading"
      :items="items"
      :search-input.sync="search"
      cache-items
      class="mx-4"
      flat
      item-text="name"
      :item-value="going ? '' : 'value'"
      hide-no-data
      hide-details
      label="O que você gostaria de ler?"
      solo-inverted
      clearable
    >
      <template v-slot:item="{ item }">
        <!--  se colocasse um v-list-item e um @click em cima dele, o slot preload do autocomplete nao fecharia
            por isso deixei um @click em cada situação possível de clique  
        -->
        <v-list-item-avatar
          @click="goToList(item)"
          color="indigo"
          class="headline font-weight-light white--text"
        >
          <v-img v-if="item.cover" :src="item.cover"></v-img>
        </v-list-item-avatar>
        <v-list-item-content @click="goToList(item)">
          <v-list-item-title v-text="item.name"></v-list-item-title>
          <v-list-item-subtitle v-text="item.author"></v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action @click="goToList(item)">
          <span class="font-weight-bold">{{item.score}}</span>
          <v-icon color="yellow">fas fa-star</v-icon>
        </v-list-item-action>
      </template>
    </v-autocomplete>
  </v-slide-x-reverse-transition>
</template>
<script>
import VueResource from "vue-resource";
import Vue from "vue";
Vue.use(VueResource);
export default {
  data() {
    return {
      loading: false,
      items: [],
      search: null,
      select: null,
      comics: [],
      going: false
    };
  },
  mounted() {
    this.going = false;
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    }
  },
  methods: {
    goToList(item) {
      this.$store.commit("LIST_COMIC", item);
      this.going = true;
      this.$router.push("list");
    },
    querySelections(v) {
      this.loading = true;
      this.searchWebComic();
      setTimeout(() => {
        this.items = this.comics.filter(e => {
          return (
            (e.name || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1
          );
        });
        this.loading = false;
      }, 500);
    },
    searchWebComic() {
      let formData = new FormData();
      formData.append("search", this.search);
      Vue.http.post("/search", formData).then(
        response => {
          this.comics = response.body.series;
        },
        err => {
          return err.response;
        }
      );
    }
  }
};
</script>