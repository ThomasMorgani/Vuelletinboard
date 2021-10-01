<template>
  <v-card>
    <v-card-title class="primary--text">DELETE USER</v-card-title>
    <v-card-text class="d-flex flex-column justify-center">
      <UserCard v-bind="{ roles, showActions: false, user }"></UserCard>
      <v-btn large outlined color="error" v-bind="btnDeleteState" @click="deleteUser" class="my-6">
        <v-icon color="error" left>mdi-delete</v-icon>

        CONFIRM DELETE
      </v-btn>
    </v-card-text>
    <v-card-actions>
      <v-btn text color="primary" @click="$emit('modalClose')">
        CANCEL
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>
<script>
  import UserCard from '@/components/Settings/Users/UserCard'
  export default {
    name: 'UserDelete',
    components: { UserCard },
    data: () => ({
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
      btnDeleteState() {
        let isLoading = this.submitted
        return { loading: isLoading }
      },
    },
    methods: {
      deleteUser() {
        // this.submitted = true
        this.$store
          .dispatch('apiGet', {
            baseurl: process.env.VUE_APP_API_ADMIN_URL,
            endpoint: 'admin/user/delete/' + this.user.id,
          })
          .then(resp => {
            console.log(resp)
            const { status, message, data } = resp
            this.$store.dispatch('snackbar', { color: status, message, value: true })
            if (status === 'success') {
              console.log('usr deleted')
              this.$emit('userDeleted', this.user.id)
            }
          })
      },
    },
  }
</script>

<style lang="scss" scoped></style>
