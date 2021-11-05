<template>
  <v-sheet color="transparent" width="100%" height="100%" class="d-flex flex-column align-center justify-center">
    <v-card text type="info" width="400" style="position: absolute; top: 10px;">
      <v-card-title class="text-h5 font-weight-bold primary--text justify-center">DEMO</v-card-title>
      <v-card-text class="d-flex flex-column align-start justify-center primary--text font-weight-bold">
        <p>
          This is a demo version of the Vulletinboard App. Some features may be unavailable and any changes made to content persist only on your local machine.
        </p>
        <p>
          To get or contribute checkout:
          <a href="https://github.com/ThomasMorgani/Vulletinboard" target="blank" class=""> <v-icon color="primary" small class="mb-1 mr-1">mdi-github</v-icon>GITHUB</a>
        </p>
        <v-sheet color="transparent" width="100%" class="d-flex justify-space-around primary--text"> <span>username: demo</span> <span>password: demo</span></v-sheet>
      </v-card-text>
    </v-card>

    <v-card class="mt-6 " elevation="" max-width="80vw" width="400">
      <v-card-title class="text-h5 font-weight-bold primary--text justify-center">WELCOME</v-card-title>
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
          <v-btn block color="primary" v-bind="btnState" type="submit" @click.prevent="submitLogin">
            LOGIN
          </v-btn>
        </form>
      </v-card-text>
      <v-card-actions style="min-height: 65px;">
        <v-alert v-show="error" dense outlined text type="error" width="400">
          {{ this.error }}
        </v-alert>
      </v-card-actions>
    </v-card>
  </v-sheet>
</template>

<script>
  import userDemo from '../../data/user_demo.json'
  export default {
    name: 'Login',
    data: () => ({
      error: null,
      demoUsername: 'demo',
      demoUsername: 'demo',
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
        return this.$store?.getters?.isAuth
      },
    },
    methods: {
      submitLogin() {
        this.error = null
        const success = this.username === this.demoUsername && this.demoPassword === this.demoPassword
        if (success) {
          localStorage.setItem('isLoggedIn', 't')
          this.$store.dispatch('init', this.$vuetify)
          this.$store.dispatch('setUserdata', userDemo)
          //todo: route depending on role
          if (this.$route?.query?.dest) {
            window.location.replace(decodeURI(this.$route.query.dest))
          } else {
            this.$router.push({ name: 'Manage' })
          }
        } else {
          this.error = 'Invalid username or password.'
        }
      },
    },
    mounted() {
      console.log(this.isLoggedIn)
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 't'
      if (isLoggedIn) {
        this.$store.dispatch('setUserdata', userDemo)
        this.$store.dispatch('init', this.$vuetify)
        this.$router.push({ name: 'User' })
      }
    },
  }
</script>

<style lang="scss" scoped></style>
