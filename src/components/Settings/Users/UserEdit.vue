<template>
  <v-card>
    <v-card-title class="primary--text"> {{ userEditing.id ? 'EDIT ' : 'ADD ' }} USER</v-card-title>
    <v-card-text class="d-flex flex-column justify-center">
      <v-text-field type="text" label="First Name" v-model="userEditing.first" outlined color="primary"></v-text-field>
      <v-text-field type="text" label="Last Name" v-model="userEditing.last" outlined color="primary"></v-text-field>
      <v-text-field type="text" label="Username" v-model="userEditing.username" outlined color="primary"></v-text-field>
      <v-text-field v-if="!userEditing.id" type="text" label="Password" v-model="userEditing.password" outlined color="primary"></v-text-field>
    </v-card-text>
    <v-card-actions>
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
        // this.submitted = true
        this.$store
          .dispatch('apiPost', {
            baseurl: process.env.VUE_APP_API_ADMIN_URL,
            endpoint: 'admin/user/add',
            postData: { ...this.userEditing },
          })
          .then(resp => {
            console.log(resp)
            const { status, message, data } = resp
            this.$store.dispatch('snackbar', { color: status, message, value: true })
            if (status === 'success') {
              console.log('usr saved')
              this.$emit('userAdded', data)
            }
          })
      },
    },
    created() {
      if (this.user) {
        //foreach values
        Object.keys(this.userEditing).forEach(item => {
          if (this.user[item] !== undefined) this.userEditing[item] = this.user[item]
        })
      }
    },
  }
</script>

<style lang="scss" scoped></style>
