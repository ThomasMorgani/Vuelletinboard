<template>
  <v-row justify="center">
    <p v-if="isLoading">loading...</p>
    <v-col v-else cols="11" md="8" lg="6" class="d-flex flex-column">
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
      <v-card flat tile>
        <v-card-title class="pa-0">
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
        </v-card-title>
        <v-card-text class="cardContent pa-1 pr-8">
          <transition-group name="slide-y-transition">
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
          @userUpdated="onUserUpdated"
          @userDeleted="onUserDeleted"
          @userRole="userRoleSet"
        ></component>
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
      getUsers() {
        this.$store
          .dispatch('apiGet', { baseurl: process.env.VUE_APP_API_ADMIN_URL, endpoint: 'admin/user' })
          .then(resp => {
            this.users = resp
            this.isLoading = false
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
        this.modalComp = 'UserDelete'
        this.modalData = { roles: this.rolesByRole, user }
        this.modalShow = true
      },
      onUserDeleted(userid) {
        this.users = [...this.users].filter(user => user.id !== userid)
        this.modalClose()
      },
      onUserUpdated(user) {
        this.users = [...this.users.filter(u => u.id != user.id), { ...user }]
        this.modalClose()
      },
      userEdit(user = {}) {
        this.modalComp = 'UserEdit'
        this.modalData = { baseurl: process.env.VUE_APP_API_ADMIN_URL, user, roles: this.roles }
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
      },
      userStatusToggle(user) {
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
  .cardContent {
    height: calc(100vh - 250px);
    overflow-y: auto;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
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
