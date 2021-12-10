<template>
  <v-row justify="center">
    <p v-if="isLoading">loading...</p>
    <v-col v-else cols="11" md="8" lg="6" class="d-flex flex-column">
      <v-card flat tile>
        <v-card-title class="pa-0">
          <v-text-field v-model="search" clearable color="primary" label="Search" outlined placeholder="" prepend-inner-icon="mdi-account-search" type="text" class=" mt-4">
            <template v-slot:append-outer>
              <v-icon color="primary" @click="userEdit()">mdi-account-plus</v-icon>
            </template>
          </v-text-field>
        </v-card-title>
        <v-card-text class="cardContent pa-1 pr-8">
          <transition-group name="slide-y-transition">
            <v-sheet key="noResults" v-if="userList.length < 1" color="transparent"><p class="text-subtitle-1 primary--text">No contacts found.</p></v-sheet>
            <UserCard
              v-for="user in userList"
              :key="user.id"
              :roles="rolesByRole"
              :user="user"
              @userDelete="onUserDelete"
              @userEdit="userEdit"
              @userPassword="userPasswordReset"
              @userRoleEdit="userRoleEdit"
              @userStatusToggle="userStatusToggle"
              class="mt-2"
            ></UserCard>
          </transition-group>
        </v-card-text>
      </v-card>
      <!-- <v-sheet class="userSearch">

      </v-sheet> -->

      <!-- MODAL -->
      <!-- Roles, Delete, Password  -->
      <v-dialog v-model="modalShow" max-width="600px" transition="dialog-transition">
        <component
          :is="modalComp"
          v-bind="modalData"
          @modalClose="modalClose"
          @userAdded="onUserAdded"
          @userDeleted="onUserDeleted"
          @userPassword="onUserPassword"
          @userRole="userRoleSet"
          @userUpdated="onUserUpdated"
        ></component>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
  import UserCard from '@/components/Settings/Users/UserCard'
  import { roles } from '@/data/user_roles.json'
  import UsersData from '@/data/users.json'

  export default {
    name: 'UserSettings',
    components: {
      UserDelete: () => import('@/components/Settings/Users/UserDelete'),
      UserEdit: () => import('@/components/Settings/Users/UserEdit'),
      UserPassword: () => import('@/components/Settings/Users/UserPassword'),
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
        let users = this.users.sort((a, b) => a.last.toLowerCase() > b.last.toLowerCase())
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
      init() {
        const localUsers = localStorage.getItem('users')
        this.users = localUsers ? JSON.parse(localUsers) : UsersData
        this.roles = roles
        this.isLoading = false
      },
      modalClose() {
        this.modalComp = null
        this.modalData = null
        this.modalShow = false
      },
      onUserAdded(user) {
        this.addUser(user)
        this.modalClose()
        this.snackbarToggle('User added.')
        this.saveUsers()
      },
      onUserDelete(user) {
        this.modalComp = 'UserDelete'
        this.modalData = { roles: this.rolesByRole, user }
        this.modalShow = true
      },
      onUserDeleted(userid) {
        this.users = [...this.users].filter(user => user.id !== userid)
        this.modalClose()
        this.snackbarToggle('User deleted.')
        this.saveUsers()
      },
      onUserPassword() {
        this.modalClose()
        this.snackbarToggle('Password updated.')
      },
      onUserUpdated(user) {
        this.users = [...this.users.filter(u => u.id != user.id), { ...user }]
        this.modalClose()
        this.saveUsers()
      },
      saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users))
      },
      snackbarToggle(message, status = 'success') {
        this.$store.dispatch('snackbar', { color: status, message: message, value: true })
      },
      userEdit(user = {}) {
        this.modalComp = 'UserEdit'
        this.modalData = { user, roles: this.roles }
        this.modalShow = true
      },
      userPasswordReset(user) {
        this.modalComp = 'UserPassword'
        this.modalData = { user }
        this.modalShow = true
      },
      userRoleEdit({ user }) {
        this.modalComp = 'UserRoles'
        this.modalData = { user, roles: this.roles }
        this.modalShow = true
      },
      userRoleSet({ userid, roles }) {
        const user = this.users.find(u => u.id === userid)
        user.role = [...roles]
        this.saveUsers()
      },
      userStatusToggle(user) {
        const status = user.status == '1' ? '0' : '1'
        this.users = [...this.users.filter(u => u.id !== user.id), { ...user, status }]
        this.snackbarToggle('Status updated.')
        this.saveUsers()
      },
    },
    created() {
      this.init()
    },
  }
</script>

<style lang="css" scoped>
  .cardContent {
    height: calc(100vh - 250px);
    overflow-y: auto;
    /* -ms-overflow-style: none; IE and Edge */
    /* scrollbar-width: none; Firefox */
  }
  .cardContent::-webkit-scrollbar {
    display: none;
  }
  .userSearch {
    position: fixed;
    top: 120px;
    z-index: 1;
    width: 100%;
    left: 0;
    padding: 0px 20px;
    right: 100px;
  }

  .userList {
    margin-bottom: 50px;
    margin-top: 100px;
  }
</style>
