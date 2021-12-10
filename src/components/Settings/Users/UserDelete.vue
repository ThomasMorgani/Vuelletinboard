<template>
  <v-card>
    <v-card-title class="primary--text">DELETE USER</v-card-title>
    <v-card-text class="d-flex flex-column justify-center">
      <UserCard v-bind="{ roles, showActions: false, user }"></UserCard>
      <v-btn large color="error" v-bind="btnDeleteState" @click="deleteUser" class="font-weight-bold my-6 ">
        <v-icon left>mdi-delete</v-icon>

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
        type: Object,
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
        this.$emit('userDeleted', this.user.id)
      },
    },
  }
</script>
