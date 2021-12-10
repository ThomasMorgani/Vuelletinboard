<template>
  <v-card>
    <v-card-title class="d-flex flex-column align-start text-h5 primary--text mb-5">
      RESET PASSWORD
      <span v-if="user.id && user.first && user.last" class="text-subtitle-2 primary--text pl-0">{{ `${user.first} ${user.last}` }}</span>
    </v-card-title>
    <v-card-text class="d-flex flex-column justify-center">
      <v-text-field
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPassword ? 'text' : 'password'"
        messages="8 character minimum"
        label="Password"
        v-model="password"
        outlined
        :color="btnSaveState.disabled ? 'primary' : 'success'"
        @click:append="showPassword = !showPassword"
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-btn text color="warning" @click="$emit('modalClose')">
        CANCEL
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn text color="primary" v-bind="btnSaveState" @click="savePassword">
        SAVE
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
  export default {
    name: 'UserPassword',
    data: () => ({
      password: null,
      showPassword: false,
      submitted: false,
    }),
    props: {
      user: {
        type: Object,
        required: false,
      },
    },
    computed: {
      btnSaveState() {
        let isDisabled = this.password == null || this.password.length < 8
        let isLoading = this.submitted
        return { disabled: isDisabled, loading: isLoading }
      },
    },
    methods: {
      savePassword() {
        this.$emit('userPassword')
      },
    },
  }
</script>
