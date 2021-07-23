<template>
  <!-- <v-icon color="primary">mdi-theme-light-dark</v-icon> -->
  <v-switch :prepend-icon="prepend" hide-details :input-value="!$vuetify.theme.isDark" @change="toggleTheme" class="mt-0 px-4"></v-switch>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'SwitchTheme',
    props: {
      prepend: {
        default: () => '',
      },
    },
    computed: {
      ...mapGetters(['isAdmin']),
    },
    methods: {
      toggleTheme() {
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark
        localStorage.setItem('isDark', this.$vuetify.theme.dark)
      },
    },
    mounted() {
      const isDark = localStorage.getItem('isDark') || false
      this.$vuetify.theme.dark = isDark === 'true'
    },
  }
</script>

<style lang="scss" scoped></style>
