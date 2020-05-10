<template>
  <div class="fill-height">
    <div class="loader">
      <loader :animation-duration="2000" :size="60" :color="'#E3F2FD'" />
    </div>
    <br />
    <div>
      <span
        style="color: #E3F2FD;
            border-bottom-color: black;"
        class="text-center font-weight-bold text-shadow"
      >Aguarde, carregando...</span>
    </div>
  </div>
</template>

<script>
import { AtomSpinner } from 'epic-spinners'
export default {
  name: "loading",
  components: {
    loader: AtomSpinner
  }
};
</script>


<style scoped>
.text-shadow {
  text-shadow: 1px 1px black;
}
.loader {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>