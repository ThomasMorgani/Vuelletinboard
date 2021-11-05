<template>
  <v-app-bar app :color="color" :height="height" ref="header" @mouseenter="toggleItems" @mouseleave="toggleItems" :style="textStyle">
    <v-toolbar-title @click="menuShow = !menuShow" v-text="text" class="text-h5"></v-toolbar-title>
    <ToolbarItems v-if="isAuth" @onProfileMenu="onProfileMenu" @logout="onLogout"></ToolbarItems>
  </v-app-bar>
</template>

<script>
  import { mapGetters } from 'vuex'
  import ToolbarItems from '@/components/Controls/ToolbarMenu'
  export default {
    name: 'Header',
    components: { ToolbarItems },
    data: () => ({
      menuShow: false,
      profileMenu: false,
      // titlebarimg: '/images/banner33.jpg',
    }),
    computed: {
      ...mapGetters(['isAdmin', 'isAuth', 'settingsByCat']),
      color() {
        return 'primary'
      },
      height() {
        return this.settings.appHeaderHeight || '80'
      },
      showMenu() {
        return this.profileMenu || (this.isAuth && this.menuShow)
      },
      settings() {
        return this.$store.state.app
      },
      text() {
        return this.settings.appName
      },
      textStyle() {
        const color = this.theme.secondary
        return {
          color,
        }
      },
      theme() {
        const { dark, light } = this.$vuetify.theme.themes
        return this.isDark ? dark : light
      },
    },
    methods: {
      onLogout() {
        this.$store.dispatch('logout')
        this.$router.push({ name: 'Login' })
      },
      onProfileMenu(isVisible) {
        this.profileMenu = isVisible
        if (!isVisible) {
          this.menuShow = false
        }
      },
      toggleItems() {
        if (!this.profileMenu) {
          this.menuShow = !this.menuShow
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  .imgclass {
    widows: 20%;
  }
  .logo {
    letter-spacing: 0.25rem;
    font-weight: bold;
    font-size: 2.5em;
  }
  ::v-deep .v-toolbar__content {
    width: 100%;
  }
  .v-toolbar__items {
    position: fixed;
    top: 0;
    right: 0;
  }
</style>
