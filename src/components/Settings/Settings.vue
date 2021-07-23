<template>
  <v-card v-if="!isLoading" flat tile v-scroll="onPageScroll" class="mx-0 pb-4">
    <v-card-title class="titleTabs  pa-0" :style="titleTabsStyle">
      <v-tabs v-model="tabs" @change="onTabChange" class="text-center px-0">
        <v-tab href="#settings"> <v-icon left> mdi-cog </v-icon> APP </v-tab>
        <v-tab href="#board"> <v-icon left> mdi-tablet-dashboard </v-icon> BOARD </v-tab>
        <v-tab href="#users"> <v-icon left> mdi-account </v-icon> USERS </v-tab>
      </v-tabs>
    </v-card-title>
    <v-card-text class="content pa-0 pr-2">
      <v-tabs-items v-model="tabs">
        <v-tab-item value="board">
          <v-sheet color="transparent" height="100%" class="d-flex flex-column">
            <ContentSettings class="mt-2"></ContentSettings>
          </v-sheet>
        </v-tab-item>
        <v-tab-item value="settings">
          <v-sheet color="transparent" height="100%" class="d-flex flex-column">
            <!-- MAKE APPSETTINGS< MOVE GENERAL, COLOR  -->
            <GeneralSettings></GeneralSettings>
            <ColorsSettings class="mt-2"></ColorsSettings>
          </v-sheet>
        </v-tab-item>
        <v-tab-item value="users" disabled>USERS </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </v-card>
</template>

<script>
  import ColorsSettings from '@/components/Settings/App/Colors'
  import GeneralSettings from '@/components/Settings/App/General'
  import ContentSettings from '@/components/Settings/Content'
  export default {
    name: 'Settings',
    components: { ColorsSettings, ContentSettings, GeneralSettings },
    data: () => ({
      isLoading: true,
      isScrolling: true,
      tabs: 'settings',
    }),
    computed: {
      titleTabsStyle() {
        const appSettings = this.$store.state.app
        const headerSettings = this.$store.state.header
        const isBulletinboard = this.$route.name === 'Bulletinboard' || headerSettings.boardHeaderPreview
        let top = isBulletinboard && headerSettings?.boardHeaderShow ? +headerSettings.boardHeaderHeight : +appSettings.appHeaderHeight
        const style = {
          top: `${top}px`,
        }
        return style
      },
    },
    methods: {
      onPageScroll(e) {
        if (this.isScrolling) return 'isLoading'
        this.isScrolling = true
        const timeout = setTimeout(() => {
          const scroll = document.documentElement.scrollTop || 0
          localStorage.setItem('lastScroll', scroll)
          const saved = parseInt(localStorage.getItem('lastScroll')) || 0
          this.isScrolling = false
        }, 1000)
      },
      onTabChange(e) {
        localStorage.setItem('settingsView', e)
      },
    },
    async mounted() {
      const view = localStorage.getItem('settingsView')
      if (view) {
        this.tabs = view
      }
      const settings = await this.$store.dispatch('apiGet', 'manage/settings')
      if (settings) {
        await this.$store.dispatch('settingsSet', settings)
      }
      this.isLoading = false
      const scroll = parseInt(localStorage.getItem('lastScroll')) || 0
      setTimeout(() => (document.documentElement.scrollTop = scroll), 500)
      document.documentElement.scrollTo({
        top: scroll,
        left: 0,
        behavior: 'smooth',
      })
      this.isScrolling = false
    },
  }
</script>

<style lang="scss" scoped>
  .titleTabs {
    position: sticky;
    left: 0px;
    z-index: 2;
  }
  .titleText {
    align-self: flex-start;
    position: sticky;
    top: 70px;
    left: 0;
    z-index: 24;
  }
  .v-window__container {
    height: 100%;
  }
  // .content {
  //   height: 80vh;
  //   overflow-y: scroll;
  // }
</style>
