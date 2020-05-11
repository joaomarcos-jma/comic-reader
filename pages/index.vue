<template>
  <div>
    <div v-if="render" :class="!isMobile ? 'align-welcome' : 'align-center'">
      <span class="font-weight-bold" :style="!isMobile ? 'font-size: 24pt' : 'font-size: 17pt'">Bem vindo ao,</span>
      <br />
      <span class="font-weight-bold" :style="!isMobile ? 'font-size: 34pt' : 'font-size: 26pt'">Comic Reader</span>
    </div>
    <v-layout column justify-center align-center>
      <v-overlay class="fill-height" :value="!render">
        <loading v-if="!render" />
      </v-overlay>
      <v-flex xs12 sm8 md6>
        <v-container v-if="render" style="text-align: center;">
          <div class="center-home">
            <div class="text-center">
              <logo :style="!isMobile ? 'height: 300px;width: 400px' : ''" />
              <div>
                <v-btn :style="!isMobile ? 'height: 100px;width: 250px' : ''" rounded outlined to="home" color="blue" x-large dark>
                  <span
                    class="font-weight-bold"
                    style="margin-left: 20px; margin-right: 15px;font-size: 17pt"
                  >ACESSAR</span>
                </v-btn>
              </div>
            </div>
          </div>
        </v-container>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Logo from "~/components/Logo";
import Loading from "~/components/Loading";

export default {
  components: { Loading, Logo },
  data: () => ({
    render: false
  }),
  mounted() {
    this.render = false;
    setTimeout(() => {
      this.render = true;
    }, 500);
  },
  computed: {
    isMobile() {
      return this.$store.state.isMobile;
    }
  }
};
</script>
<style>
.center-home {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.align-welcome {
  color: white;
  margin-top: 70px;
  text-align: left;
  margin-left: 10%;
}
.align-center {
  color: white;
  margin-top: 50px;
  text-align: center;
}
</style>
