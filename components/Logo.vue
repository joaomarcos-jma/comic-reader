<template>
  <img class="Logo" alt="Logo" :src="require('../static/logos/logo_oficial_comic_reader.png')" />
</template>

<style>
.Logo {
  height: 190px;
  width: 280px;
  transform: rotateY(560deg);
  animation: turn 3.5s ease-out forwards 1s;
}

@keyframes turn {
  100% {
    transform: rotateY(0deg);
  }
}
</style>
