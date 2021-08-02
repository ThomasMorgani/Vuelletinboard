<template>
  <v-sheet color="transparent" width="100%" height="100%" class="d-flex align-center justify-center">
    <v-card class="" elevation="" max-width="80vw" width="400">
      <v-card-title>Welcome</v-card-title>
      <v-card-text>
        <form>
          <v-text-field v-model="username" label="Username" prepend-icon="mdi mdi-account" type="text"></v-text-field>
          <v-text-field
            v-model="password"
            :append-icon="showPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"
            label="Password"
            prepend-icon="mdi mdi-key"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
          ></v-text-field>
        </form>
      </v-card-text>
      <v-card-actions>
        <v-btn block color="primary" v-bind="btnState">
          LOGIN
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-sheet>
</template>

<script>
  export default {
    name: 'Login',
    data: () => ({
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
    },
  }
</script>

<style lang="scss" scoped></style>
