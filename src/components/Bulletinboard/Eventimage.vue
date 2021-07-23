<template>
  <v-sheet height="100%" width="70vw" min-width="70vw" class="d-flex align-center justify-center" color="transparent">
    <v-icon v-show="isError" color="primary" size="100" class="fallbackImage" transition="fade-transition">mdi-image</v-icon>
    <transition name="slide-fade">
      <v-img contain max-height="100%" max-width="100%" :src="imgSrc" :key="image" @error="isError = true" class="displayedImage"></v-img>
    </transition>
  </v-sheet>
</template>

<script>
  export default {
    name: 'EventImage',
    props: {
      image: {
        type: String,
        default: () => 'bb_fallback_img.png',
      },
    },
    data: () => ({
      isError: false,
      fallback: 'bb_fallback_img.png',
    }),
    computed: {
      imgSrc() {
        return this.isError ? `${process.env.VUE_APP_MEDIA_URL}${this.fallback}` : `${process.env.VUE_APP_MEDIA_URL}${this.image}`
      },
    },
  }
</script>

<style lang="scss" scoped>
  .displayedImage {
    z-index: 2;
  }
  .fallbackImage {
    position: absolute;
    z-index: 1;
  }
  /* TRANSITIONS */

  /* Enter and leave animations can use different */
  /* durations and timing functions.              */
  .slide-fade-enter-active {
    transition: all 0.3s ease;
  }
  .slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
