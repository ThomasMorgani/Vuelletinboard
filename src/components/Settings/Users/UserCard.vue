<template>
  <v-card>
    <v-card-text class="d-flex">
      <v-sheet class="d-flex flex-column align-center justify-center text-center flex-shrink-1">
        <v-avatar color="primary" size="50">
          <v-icon color="secondary" large>mdi mdi-account</v-icon>
        </v-avatar>
      </v-sheet>
      <v-sheet class="text-start flex-grow-1 ml-6">
        <v-sheet class="text-h6 primary--text font-weight-bold">
          {{ `${user.last}, ${user.first}` }}
        </v-sheet>
        <v-sheet class="d-flex">
          <v-sheet class="d-flex flex-column align-start justify-start flex-shrink-1 ml-1">
            <v-sheet v-for="detail in details" :key="detail.key" color="transparent" class="d-flex">
              <v-sheet color="transparent" width="100" class="d-flex">
                <p class="font-weight-bold">
                  {{ detail.label + ':' }}
                </p>
              </v-sheet>
              <v-sheet color="transparent" class="d-flex">
                <p>
                  {{ user[detail.key] || ' ' }}
                </p>
              </v-sheet>
            </v-sheet>
            <v-sheet color="transparent" class="d-flex">
              <v-sheet color="transparent" width="100" class="d-flex">
                <p class="font-weight-bold">
                  Roles:
                </p>
              </v-sheet>
              <v-sheet color="transparent" class="d-flex align-center justify-start">
                <div v-if="!user.role || user.role.length < 1">
                  <span>No assigned roles</span>
                </div>
                <div v-else class="rolesDiv">
                  <v-chip v-for="role in userRoles" :key="role" color="primary" small class="mr-1 mb-1">{{ role }}</v-chip>
                </div>
              </v-sheet>
            </v-sheet>
          </v-sheet>
        </v-sheet>
      </v-sheet>
    </v-card-text>
    <v-card-actions v-if="showActions" class="d-flex align-center justify-space-between">
      <v-btn outlined tile color="error" small @click="$emit('userDelete', user)"> <v-icon color="error" left>mdi mdi-trash-can</v-icon> DELETE</v-btn>
      <v-btn outlined tile color="warning" small @click="$emit('userEdit', user)"> <v-icon color="warning" left>mdi mdi-account-edit</v-icon> EDIT</v-btn>
      <v-btn outlined tile color="primary" small @click="$emit('userPassword', user)"> <v-icon color="primary" left>mdi mdi-key</v-icon> PASSWORD</v-btn>
      <v-btn outlined tile color="purple" small @click="editRole"> <v-icon color="purple" left>mdi mdi-account-tie</v-icon> ROLES</v-btn>
      <v-btn outlined tile :color="isActive ? 'success' : 'grey'" small @click="toggleStatus">
        <v-icon :color="isActive ? 'success' : 'grey'" left>{{ `mdi mdi-${isActive ? 'account-check' : 'account-cancel'}` }}</v-icon>
        {{ isActive ? 'ENABLED' : 'DISABLED' }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: 'userCard',
    props: {
      showActions: {
        type: Boolean,
        default: () => true,
      },
      roles: {
        type: Object,
        required: true,
      },
      user: {
        type: Object,
        required: true,
      },
    },
    data: () => ({
      details: [
        {
          label: 'First name',
          key: 'first',
        },
        {
          label: 'Last name',
          key: 'last',
        },
        {
          label: 'Username',
          key: 'username',
        },
        {
          label: 'Email',
          key: 'email',
        },
        {
          label: 'Last login',
          key: 'lastLogin',
        },
      ],
    }),
    computed: {
      isActive() {
        return this.user.status == '1'
      },
      userRoles() {
        return [...this.user.role].map(role => this?.roles?.[role]?.label).sort((a, b) => a.localeCompare(b))
      },
    },
    methods: {
      editRole() {
        this.$emit('userRoleEdit', { user: this.user })
      },
      toggleStatus() {
        this.$emit('userStatusToggle', this.user)
      },
    },
  }
</script>

<style scoped>
  p {
    margin: 0;
  }
  .rolesDiv {
    overflow: hidden;
  }
</style>
