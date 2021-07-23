<template>
  <v-toolbar-items transition="scroll-y-transition" class="primary">
    <!-- <v-btn text class="secondary--text"> <v-icon left>mdi-plus</v-icon>Add New </v-btn> -->
    <v-btn text class="secondary--text" exact :to="{ name: 'Bulletinboard' }"> <v-icon left>mdi-pin</v-icon>Bulletinboard </v-btn>
    <v-btn text class="secondary--text" :to="{ name: 'Manage' }"> <v-icon left>mdi-clipboard-text</v-icon>Content </v-btn>
    <v-btn v-if="isAdmin" text class="secondary--text" :to="{ name: 'Settings' }"><v-icon left>mdi-cog</v-icon>ADMIN</v-btn>
    <v-menu v-model="userMenu" bottom :close-on-content-click="false" offset-y open-on-hover>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="secondary" text v-bind="attrs" v-on="on"> <v-icon left>mdi-account-circle</v-icon>Profile </v-btn>
      </template>
      <v-list dense>
        <v-list-item>
          <v-list-item-avatar>
            <v-icon color="primary">mdi-theme-light-dark</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="text-center  primary--text">
            <ThemeToggle></ThemeToggle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item a href="https://eipl.org/bulletinboard/user">
          <v-list-item-avatar>
            <v-icon color="primary">mdi-account-circle</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="text-left primary--text">
            <v-list-item-title class="font-weight-bold">PROFILE</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item a href="https://eipl.org/bulletinboard/login/logout">
          <v-list-item-avatar>
            <v-icon color="primary">mdi-logout-variant</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="text-left primary--text">
            <v-list-item-title class=" font-weight-bold">LOGOUT</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-toolbar-items>
</template>

<script>
  import ThemeToggle from '@/components/Controls/SwitchTheme'
  import { mapGetters } from 'vuex'
  export default {
    name: 'ToolbarItems',
    components: { ThemeToggle },
    data: () => ({
      userMenu: false,
    }),
    computed: {
      ...mapGetters(['isAdmin', 'isAuth', 'settingsByCat']),
    },
  }
</script>

<style lang="scss" scoped></style>
