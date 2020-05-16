<template>
  <v-app dark>
    <v-app-bar
      v-if="showMenu && isMobile"
      dark
      :class="{'transparent': !showNavbar}"
      :hide-on-scroll="true"
      :src="require('../static/solo.png')"
      app
    >
      <v-toolbar-title class="text-center">
        <v-avatar size="70">
          <v-img :src="require('../static/logos/logo_oficial_comic_reader.png')"></v-img>
        </v-avatar>
      </v-toolbar-title>

      <template v-slot:extension>
        <v-tabs v-model="tab" align-with-title>
          <v-tab v-for="item in items" :key="item.tab" :to="item.to">{{ item.title }}</v-tab>
        </v-tabs>
      </template>
      <v-spacer></v-spacer>
      <search v-show="action" />
      <v-btn @click="action = !action" x-large icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>
    <v-app-bar v-if="showMenu && !isMobile" absolute dark hide-on-scroll app>
      <v-spacer></v-spacer>
      <v-toolbar-title style="margin-top: 15px;">
        <v-avatar size="80">
          <v-img :src="require('../static/logos/logo_oficial_comic_reader.png')"></v-img>
        </v-avatar>
      </v-toolbar-title>
      <template v-slot:extension>
        <v-tabs style="margin-top: 3px;margin-left: 30%" v-model="tab" align-with-title>
          <v-tab v-for="item in items" :key="item.tab" :to="item.to">{{ item.title }}</v-tab>
        </v-tabs>
      </template>
      <v-spacer></v-spacer>
      <search v-show="action" />
      <v-btn @click="action = !action" x-large icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Search from "~/components/Search";
export default {
  components: { Search },
  data: () => ({
    tab: null,
    clipped: false,
    drawer: false,
    fixed: false,
    sideNav: false,
    action: false,
    items: [
      {
        title: "Home",
        to: "/home",
        id: 1
      },
      {
        title: "Comics",
        to: "/list",
        id: 2
      }
    ],
    miniVariant: false,
    right: true,
    rightDrawer: false,
    title: "Comic Reader",
    showNavbar: true,
    lastScrollPosition: 0
  }),
  mounted() {
    this.onResize();
    this.checkItemsTab();
    window.addEventListener("resize", this.onResize, { passive: true });
    window.addEventListener("scroll", this.onScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll);
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.onResize, { passive: true });
    }
  },
  watch: {
    infoComic(value) {
      value ? this.checkItemsTab() : "";
    }
  },
  methods: {
    checkItemsTab() {
      if (this.infoComic && this.infoComic.id_serie) {
        let routeList = this.items.find(res => res.id === 2);
        return !routeList
          ? this.items.push({
              title: "Comics",
              to: "/list",
              id: 2
            })
          : "";
      }
      let index;
      this.items.map((res, i) => {
        return res.id === 2 ? (index = i) : "";
      });
      index ? this.items.splice(index, 1) : "";
    },
    onResize() {
      let isMobile = window.innerWidth < 600;
      this.$store.commit("SET_MOBILE", isMobile);
    },
    onScroll() {
      const currentScrollPosition =
        window.pageYOffset || document.documentElement.scrollTop;
      if (currentScrollPosition < 0) {
        return;
      }
      if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 60) {
        return;
      }
      this.showNavbar = currentScrollPosition < this.lastScrollPosition;
      this.lastScrollPosition = currentScrollPosition;
    }
  },
  computed: {
    showMenu() {
      if (!["index", "viewer"].includes(this.$route.name)) {
        return true;
      }
    },
    isMobile() {
      return this.$store.state.isMobile;
    },
    infoComic() {
      return this.$store.state.infoComic;
    }
  }
};
</script>
<style>
.background-home {
  /* The image used */
  background-color: #b96e4b;
  /* Half height */
  height: auto;
  max-width: auto;
  /* Center and scale the image nicely */
  background-repeat: no-repeat;
  background-size: cover;
}
.transparent {
  opacity: 0.5;
}
</style>
