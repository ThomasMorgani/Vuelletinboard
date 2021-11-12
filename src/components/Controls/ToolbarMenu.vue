<template>
  <v-toolbar-items transition="scroll-y-transition" class="primary">
    <!-- <v-btn text class="secondary--text"> <v-icon left>mdi-plus</v-icon>Add New </v-btn> -->
    <v-btn text class="secondary--text">DEMO: </v-btn>

    <v-btn text class="secondary--text" exact :to="{ name: 'Bulletinboard' }"> <v-icon left>mdi-pin</v-icon>Bulletinboard </v-btn>
    <v-btn v-if="hasRole('vbContentManage')" text class="secondary--text" exact :to="{ name: 'Manage' }"> <v-icon left>mdi-clipboard-text</v-icon>Content </v-btn>
    <v-btn v-if="hasRole('isAdmin')" text class="secondary--text" :to="{ name: 'Settings' }"><v-icon left>mdi-cog</v-icon>ADMIN</v-btn>
    <v-menu v-model="userMenu" bottom :close-on-content-click="false" offset-y open-on-hover @input="onInput">
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
        <v-list-item :to="{ name: 'User' }">
          <v-list-item-avatar>
            <v-icon color="primary">mdi-account-circle</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="text-left primary--text">
            <v-list-item-title class="font-weight-bold">PROFILE</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout">
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
  import { mapGetters, mapState } from 'vuex'
  //MAP NAVITEMS TO ROLES TO SHOW
  export default {
    name: 'ToolbarItems',
    components: { ThemeToggle },
    data: () => ({
      navLinks: {},
      userMenu: false,
    }),
    computed: {
      ...mapGetters(['isAdmin', 'isAuth', 'settingsByCat']),
      ...mapState({
        user: state => state.user,
      }),
    },
    methods: {
      hasRole(role) {
        return this.user?.role?.includes(role)
      },
      logout() {
        this.$emit('logout')
      },
      //emit menu state so parent menu can track visibility
      onInput(isVisible) {
        this.$emit('onProfileMenu', isVisible)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
