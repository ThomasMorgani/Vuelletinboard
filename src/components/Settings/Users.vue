<template>
  <v-row justify="center">
    <p v-if="isLoading">loading...</p>
    <v-col v-else cols="11" md="7" lg="6" class="d-flex flex-column">
      <!-- TEMP -->
      <!-- <v-dialog v-model="modalAddRole" width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
              ADD ROLE
            </v-btn>
          </template>

          <v-card>
            <v-card-title> </v-card-title>
            <v-card-text>
              <v-text-field type="text" label="Role" v-model="newRole.role" outlined color></v-text-field>
              <v-text-field type="text" label="Label" v-model="newRole.label" outlined color></v-text-field>
              <v-text-field type="text" label="Description" v-model="newRole.description" outlined color></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn color="error" text @click="modalAddRole = false">
                CANCEL
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" :loading="roleSubmitted" text @click="userRoleSave">
                SAVE
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog> -->
      <v-sheet>
        <v-text-field
          v-model="search"
          clearable
          color="primary"
          label="Search"
          outlined
          placeholder=""
          append-outer-icon="mdi-account-plus"
          prepend-inner-icon="mdi-account-search"
          type="text"
          class=" mt-4"
          @click:append-outer="userEdit()"
        ></v-text-field>
      </v-sheet>

      <UserCard
        v-for="user in userList"
        :key="user.id"
        :roles="rolesByRole"
        :user="user"
        @userDelete="onUserDelete"
        @userRoleEdit="userRoleEdit"
        @userStatusToggle="userStatusToggle"
        class="mt-2"
      ></UserCard>
      <!-- MODAL -->
      <!-- Roles, Delete, Password  -->
      <v-dialog v-model="modalShow" max-width="600px" transition="dialog-transition">
        <component :is="modalComp" v-bind="modalData" @modalClose="modalClose" @userAdded="onUserAdded" @userDeleted="onUserDeleted" @userRole="userRoleSet"></component>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
  import UserCard from '@/components/Settings/Users/UserCard'

  export default {
    name: 'UserSettings',
    components: {
      UserDelete: () => import('@/components/Settings/Users/UserDelete'),
      UserEdit: () => import('@/components/Settings/Users/UserEdit'),
      UserRoles: () => import('@/components/Settings/Users/UserRoles'),
      UserCard,
    },
    data: () => ({
      isLoading: true,
      modalComp: null,
      modalData: null,
      modalShow: false,
      newRole: {
        role: '',
        label: '',
        description: '',
      },
      roles: [],
      roleSubmitted: false,
      search: null,
      users: null,
    }),
    computed: {
      rolesByRole() {
        const roles = {}
        this.roles.forEach(role => {
          roles[role.role] = role
        })
        return roles
      },
      userList() {
        let users = this.users.sort((a, b) => a.last > b.last)
        if (this.search) {
          const search = this.search.toLowerCase()
          users = users.filter(user => {
            return user.first.toLowerCase().includes(search) || user.last.toLowerCase().includes(search) || user.username.toLowerCase().includes(search)
          })
        }

        return users
      },
    },
    methods: {
      addUser(user) {
        this.users = [...this.users, user]
      },
      getUsers() {
        this.$store
          .dispatch('apiGet', { baseurl: process.env.VUE_APP_API_ADMIN_URL, endpoint: 'admin/user' })
          .then(resp => {
            this.users = resp
            this.isLoading = false
            console.log(resp)
          })
          .catch(err => console.log(err))
      },
      init() {
        this.$store
          .dispatch('apiGet', { baseurl: process.env.VUE_APP_API_ADMIN_URL, endpoint: 'admin' })
          .then(resp => {
            this.roles = resp.roles || []
            this.users = resp.users || []
            this.isLoading = false
            console.log(resp)
          })
          .catch(err => console.log(err))
      },
      modalClose() {
        this.modalComp = null
        this.modalData = null
        this.modalShow = false
      },
      onUserAdded(user) {
        this.addUser(user)
        this.modalClose()
      },
      onUserDelete(user) {
        console.log(user)
        this.modalComp = 'UserDelete'
        this.modalData = { roles: this.roles, user }
        this.modalShow = true
      },
      onUserDeleted(userid) {
        this.users = [...this.users].filter(user => user.id !== userid)
        this.modalClose()
      },
      userEdit(user = {}) {
        console.log(user)
        this.modalComp = 'UserEdit'
        this.modalData = { user, roles: this.roles }
        this.modalShow = true
      },
      userRoleEdit({ user }) {
        console.log(user)
        this.modalComp = 'UserRoles'
        this.modalData = { user, roles: this.roles }
        this.modalShow = true
      },
      userRoleSet({ userid, roles }) {
        const user = this.users.find(u => u.id === userid)
        user.role = [...roles]
      },
      // userRoleSave() {
      //   console.log('userRoleSave')
      //   this.$store.dispatch('apiPost', { baseurl: process.env.VUE_APP_API_ADMIN_URL, endpoint: 'admin/role/add', postData: this.newRole }).then(resp => {
      //     console.log(resp)
      //     if (resp?.status === 'success') {
      //       this.roles.push(this.newRole)
      //       this.newRole = { description: '', label: '', role: '' }
      //     }
      //     this.$store.dispatch('snackbar', { color: resp.status, message: resp.message, value: true })
      //   })
      // },
      userStatusToggle(user) {
        console.log(user)
        //dispatch toggle,
        //if success
        const status = user.status == '1' ? '0' : '1'
        this.$store
          .dispatch('apiPost', {
            baseurl: process.env.VUE_APP_API_ADMIN_URL,
            endpoint: 'admin/user/update/' + user.id,
            postData: { status },
          })
          .then(resp => {
            if (resp?.status === 'success') {
              this.users = [...this.users.filter(u => u.id !== user.id), { ...user, status }]
            }
            this.$store.dispatch('snackbar', { color: resp.status, message: resp.message, value: true })
          })
      },
    },
    created() {
      this.init()
    },
  }
</script>

<style lang="css" scoped>
  .userSearch {
    position: sticky;
    top: 140px;
    z-index: 3;
  }
</style>
