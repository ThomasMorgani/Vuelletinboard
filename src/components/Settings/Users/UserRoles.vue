<template>
  <v-card class="text-left pt-4">
    <v-card-text>
      <v-list flat two-line>
        <v-subheader class="d-flex flex-column align-start text-h5 primary--text mb-4"
          ><div>
            USER ROLES
          </div>
          <div class="text-subtitle-2 primary--text" v-if="user.first && user.last">{{ `${user.first} ${user.last}` }}</div>
        </v-subheader>

        <v-list-item v-for="role in roles" :key="role.role">
          <v-list-item-content>
            <v-list-item-title v-text="role.label"></v-list-item-title>
            <v-list-item-subtitle v-text="role.description"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-progress-circular v-if="switchLoading === role.role" indetermintate></v-progress-circular>
            <v-switch v-else :input-value="userRolesState[role.role]" :value="userRolesState[role.role]" @click="roleToggle(role.role)"></v-switch>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-btn text color="warning" @click="$emit('modalClose')">
        CANCEL
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: 'userRoles',
    props: {
      roles: {
        type: Array,
        required: true,
      },
      user: {
        type: Object,
        required: true,
      },
    },
    data: () => ({
      switchLoading: null,
    }),
    computed: {
      userRolesState() {
        const roles = {}
        this.roles.forEach(role => {
          roles[role.role] = this.hasRole(role.role)
        })
        return roles
      },
    },
    methods: {
      hasRole(role) {
        return this.user.role.includes(role)
      },
      roleToggle(role) {
        this.switchLoading = role
        const action = this.userRolesState[role] ? 'remove' : 'add'
        const endpoint = `admin/role/${this.user.id}/${role}/${action}`
        this.$store
          .dispatch('apiGet', {
            baseurl: process.env.VUE_APP_API_ADMIN_URL,
            endpoint,
          })
          .then(resp => {
            const { status, message, data } = resp
            this.$store.dispatch('snackbar', { color: status, message, value: true })
            if (status === 'success') {
              const roles = action === 'add' ? [...this.user.role, role] : [...this.user.role].filter(r => r !== role)
              this.$emit('userRole', { userid: this.user.id, roles })
            }
            this.switchLoading = null
          })
      },
    },
  }
</script>

<style lang="scss" scoped></style>
