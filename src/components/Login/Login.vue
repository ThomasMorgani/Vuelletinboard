<template>
  <v-sheet color="transparent" width="100%" height="100%" class="d-flex flex-column align-center justify-center">
    <v-alert v-show="error" outlined text type="error" width="400">
      {{ this.error }}
    </v-alert>

    <v-card class="" elevation="" max-width="80vw" width="400">
      <v-card-title class="text-h5 primary--text">Welcome</v-card-title>
      <v-card-text v-if="!isLoggedIn">
        <form @submit.prevent="submitLogin">
          <v-text-field v-model="username" label="Username" prepend-icon="mdi mdi-account" type="text"></v-text-field>
          <v-text-field
            v-model="password"
            :append-icon="showPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"
            label="Password"
            prepend-icon="mdi mdi-key"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
          ></v-text-field>
          <v-btn block color="primary" v-bind="btnState" type="submit">
            LOGIN
          </v-btn>
        </form>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<script>
  export default {
    name: 'Login',
    data: () => ({
      error: null,
      username: null,
      password: null,
      showPassword: false,
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
        return this.$store?.state?.user?.id || false
      },
    },
    methods: {
      submitLogin() {
        console.log(process.env.VUE_APP_API_AUTH_URL)
        this.error = null
        this.$store
          .dispatch('apiPost', {
            baseurl: process.env.VUE_APP_API_AUTH_URL,
            endpoint: 'login',
            postData: { username: this.username, password: this.password },
          })
          .then(resp => {
            console.log(resp)
            const { status, message, data } = resp
            if (status === 'success') {
              console.log('logn success!')
              this.$store.dispatch('init', this.$vuetify)
              this.$store.dispatch('setUserdata', data)
              //route depending on role
              console.log(data)
              if (this.$route?.query?.dest) {
                window.location.replace(decodeURI(this.$route.query.dest))
              } else {
                window.location.replace('https://www.eipl.org/staff')
              }

              // this.$router.push({ name: 'Manage' })
            } else {
              this.error = message
            }
          })
      },
    },
    mounted() {
      console.log(this.isLoggedIn)
      if (this.isLoggedIn) {
        this.$router.push({ name: 'User' })
      }
    },
  }
</script>

<style lang="scss" scoped></style>
