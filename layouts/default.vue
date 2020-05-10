<template>
  <v-app dark>
    <v-navigation-drawer class="transparent" v-model="drawer" :mini-variant="miniVariant" fixed app>
      <div style="margin-top: 30px" class="center-block logo;">
        <v-list-item class="px-2">
          <!-- <v-list-item-avatar>
            <v-img v-if="avatar" :src="avatar"></v-img>
          </v-list-item-avatar> -->
          <v-list-item-content >
            <v-list-item-title style="font-size: 14pt">{{'Bem vindo ao Comic Reader'}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>

      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar class="transparent" :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-content style="margin-top: -30px" class="background-home">
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-apps",
          title: "Welcome",
          to: "/"
        },
        {
          icon: "mdi-chart-bubble",
          title: "Inspire",
          to: "/inspire"
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Comic Reader"
    };
  }
};
</script>
<style>
.background-home {
  /* The image used */
  background-image: url("../static/solo.png");
  /* Half height */
  height: 100%;
  max-width: auto;
  /* Center and scale the image nicely */
  background-repeat: no-repeat;
  background-size: cover;
}
.transparent {
  opacity: 0.5;
}
</style>
