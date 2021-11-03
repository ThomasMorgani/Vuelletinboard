<template>
  <v-sheet color="transparent" width="100%" height="100%" class="d-flex flex-column align-center justify-center">
    <v-card elevation="" max-width="80vw" width="600">
      <v-card-title class="text-h4 primary--text justify-center py-4">{{ user ? `${user.first} ${user.last}` : '' }}</v-card-title>
      <v-card-text>
        <v-avatar color="primary" size="175">
          <v-icon size="150" color="secondary"> mdi mdi-account</v-icon>
        </v-avatar>
        <v-card flat class="my-5">
          <v-card-text>
            <v-sheet color="transparent" class="text-left text-h6 primary--text">
              RESET PASSWORD
            </v-sheet>

            <v-text-field
              :append-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showCurrentPassword ? 'text' : 'password'"
              label="Current Password"
              v-model="currentPassword"
              outlined
              color="primary"
              @click:append="showCurrentPassword = !showPassword"
            ></v-text-field>
            <v-text-field
              :append-icon="showNewPaswword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showNewPaswword ? 'text' : 'password'"
              label="New Password"
              v-model="newPassword"
              outlined
              color="primary"
              @click:append="showNewPaswword = !showPassword"
            ></v-text-field>
            <v-btn block color="success" v-bind="btnState" @click="savePassword">
              UPDATE
            </v-btn>
          </v-card-text>
        </v-card>
      </v-card-text>
      <v-card-actions>
        <!-- <v-btn block color="primary" :loading="submitted" class="font-weight-bold" @click="submitLogout"> <v-icon left> mdi mdi-logout</v-icon> LOGOUT</v-btn> -->
      </v-card-actions>
    </v-card>
  </v-sheet>
</template>

<script>
  export default {
    name: 'User',
    data: () => ({
      currentPassword: null,
      message: null,
      newPassword: null,
      showCurrentPassword: false,
      showNewPaswword: false,
      submitted: false,
    }),
    computed: {
      btnState() {
        if (this.submitted) {
          return { loading: true }
        }
        if (!this.currentPassword || !this.newPassword) {
          return { disabled: true }
        }
      },
      isLoggedIn() {
        return this.$store?.getters?.isAuth || false
      },
      user() {
        return this.$store?.state?.user || null
      },
    },
    methods: {
      savePassword() {
        // this.submitted = true
        this.$store
          .dispatch('apiPost', {
            baseurl: process.env.VUE_APP_API_AUTH_URL,
            endpoint: `reset`,
            postData: { currentPassword: this.currentPassword, newPassword: this.newPassword, username: this.user.username },
          })
          .then(resp => {
            console.log(resp)
            const { status, message, data } = resp
            this.$store.dispatch('snackbar', { color: status, message, value: true })
            if (status === 'success') {
              console.log('passwd reset ')
              this.currentPassword = null
              this.newPassword = null
            }
          })
      },
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
