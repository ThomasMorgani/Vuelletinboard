<template>
  <v-sheet color="transparent" width="100%" height="100%" class="d-flex flex-column align-center justify-center">
    <v-card elevation="" max-width="80vw" width="400" class="pa-4">
      <v-card-title class="text-h4 primary--text justify-center py-4">{{ user ? `${user.first} ${user.last}` : '' }}</v-card-title>
      <v-card-text v-if="!isLoggedIn">
        <v-avatar color="primary" size="175">
          <v-icon size="150"> mdi mdi-account</v-icon>
        </v-avatar>
      </v-card-text>
      <v-card-actions>
        <v-btn block color="primary" :loading="submitted" class="font-weight-bold" @click="submitLogout"> <v-icon left> mdi mdi-logout</v-icon> LOGOUT</v-btn>
      </v-card-actions>
    </v-card>
  </v-sheet>
</template>

<script>
  export default {
    name: 'User',
    data: () => ({
      message: null,
      submitted: false,
    }),
    computed: {
      btnState() {
        if (this.submitted) {
          return { loading: true }
        }
        if (this.username === null || this.password === null) {
          return { disabled: true }
        }
      },
      isLoggedIn() {
        return this.$store?.state?.getters?.isAuth || false
      },
      user() {
        return this.$store?.state?.user || null
      },
    },
    methods: {
      submitLogout() {
        this.$store.dispatch('apiGet', { baseurl: process.env.VUE_APP_API_AUTH_URL, endpoint: 'logout' }).then(resp => {
          console.log(resp)
          if (resp.status === 'success') {
            //LogoutUser
            this.$router.push({ name: 'Login' })
            this.$store.dispatch('setUserdata', {})
          } else {
            this.$store.dispatch('snackbar', { color: resp.status, message: resp.message, value: true })
          }
          // this.message = null
          // this.$store.dispatch('apiGet', { baseurl: process.env.VUE_APP_API_AUTH_URL, endpoint: 'logout' }).then(resp => {
          //   console.log(resp)
          //   const { status, message, data } = resp
          //   if (status === 'success') {
          //     console.log('logout success!')
          //     this.$router.push({ name: 'Login' })
          //   } else {
          //     this.message = message
          //   }
        })
      },
    },
    mou() {
      if (!this.isLoggedIn) this.$router.push({ name: 'Login' })
    },
  }
</script>

<style lang="scss" scoped></style>
