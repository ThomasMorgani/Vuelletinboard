<template>
  <v-card>
    <v-card-title class="d-flex flex-column align-start text-h5 primary--text mb-5">
      {{ userEditing.id ? 'EDIT ' : 'ADD ' }} USER
      <span v-if="userEditing.id && user.first && user.last" class="text-subtitle-2 primary--text pl-0">{{ `${user.first} ${user.last}` }}</span>
    </v-card-title>
    <v-card-text class="d-flex flex-column justify-center">
      <v-text-field type="text" label="First Name" v-model="userEditing.first" outlined color="primary"></v-text-field>
      <v-text-field type="text" label="Last Name" v-model="userEditing.last" outlined color="primary"></v-text-field>
      <v-text-field type="text" label="Username" v-model="userEditing.username" outlined color="primary"></v-text-field>
      <v-text-field type="text" label="Email" v-model="userEditing.email" outlined color="primary"></v-text-field>
      <v-text-field
        v-if="!userEditing.id"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPassword ? 'text' : 'password'"
        label="Password"
        v-model="userEditing.password"
        outlined
        color="primary"
        @click:append="showPassword = !showPassword"
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-btn text color="warning" @click="$emit('modalClose')">
        CANCEL
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn text color="primary" v-bind="btnSaveState" @click="saveUser">
        {{ userEditing.id ? 'SAVE ' : 'ADD ' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
  export default {
    name: 'UserEdit',
    data: () => ({
      userEditing: {
        email: null,
        first: null,
        id: null,
        last: null,
        password: null,
        role: [],
        username: null,
      },
      showPassword: false,
      submitted: false,
    }),
    props: {
      roles: {
        type: Array,
        required: true,
      },
      user: {
        type: Object,
        required: false,
      },
    },
    computed: {
      btnSaveState() {
        let isDisabled = false
        let isLoading = this.submitted
        const requiredFields = ['first', 'last', 'username']
        if (!this.user.id) requiredFields.push('password')
        //if !id , check password, roles
        requiredFields.forEach(field => {
          if (this.userEditing[field] == null || this.userEditing[field] == '') isDisabled = true
        })
        return { disabled: isDisabled, loading: isLoading }
      },
    },
    methods: {
      saveUser() {
        this.submitted = true
        const action = this.user?.id ? 'userUpdated' : 'userAdded'
        const userData = { ...this.userEditing }
        if (action === 'userAdded') userData.id = new Date().getTime()
        this.$emit(action, userData)
      },
    },
    created() {
      if (this.user) {
        Object.keys(this.userEditing).forEach(item => {
          if (this.user[item] !== undefined) this.userEditing[item] = this.user[item]
        })
      }
    },
  }
</script>
