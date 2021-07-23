<template>
  <v-app id="app">
    <component :is="headerShown"></component>
    <v-main :style="mainStyle">
      <v-progress-circular v-if="appLoading" color="primary" indeterminate></v-progress-circular>
      <router-view v-else />
      <v-snackbar :value="snackbar.value" v-bind="snackbar.options" @input="snackbar = $event" content-class="font-weight-bold">
        {{ snackbar.message }}

        <template v-slot:action="{ attrs }">
          <v-btn icon v-bind="attrs" @click="snackbar = false">
            <v-icon :color="snackbar.options.color"> mdi-close </v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
    <Ticker v-if="tickerShow"></Ticker>
  </v-app>
</template>
<script>
  import { mapState } from 'vuex'
  import Ticker from '@/components/Bulletinboard/Ticker'
  export default {
    name: 'Vulletinboard',
    components: {
      BoardHeader: () => import('@/components/Bulletinboard/Header'),
      Header: () => import('@/components/Layout/Header'),
      Ticker,
    },
    computed: {
      ...mapState({
        appLoading: state => state.appLoading,
        headerSettings: state => state.header,
        settings: state => state.settings,
        snackbarStore: state => state.snackbar,
        ticker: state => state.ticker,
      }),
      headerShown() {
        return this.isBulletinboard ? 'BoardHeader' : 'Header'
      },
      isBulletinboard() {
        if (this.$route.name === 'Bulletinboard') return true
        return this.headerSettings?.boardHeaderPreview && this.headerSettings?.boardHeaderShow
      },
      mainStyle() {
        return {
          // background: 'black',
        }
      },
      snackbar: {
        get() {
          return this.snackbarStore
        },
        set(v) {
          this.$store.dispatch('snackbar', { color: 'primary', message: '', value: v })
        },
      },
      tickerShow() {
        if (this.$route.name === 'Bulletinboard') return this?.ticker?.tickerShow
        if (this.$route.name === 'Settings') return this?.ticker?.tickerPreview
        return false
      },
    },
    mounted() {
      this.$store.dispatch('init', this.$vuetify)
    },
  }
</script>
<style lang="scss">
  html {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  /* Hide scrollbar for Chrome, Safari and Opera */
  html::-webkit-scrollbar {
    display: none;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    font-size: 62.5%;
    margin: 0;
    padding: 0;
  }

  .titlebartext {
    z-index: 1;
  }
</style>
