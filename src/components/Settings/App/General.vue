<template>
  <v-card flat tile width="100%">
    <v-card-text>
      <v-card outlined class="my-1">
        <v-card-title class="text-h5 primary--text pb-2">
          General
        </v-card-title>
        <v-card-text class="d-flex flex-column align-start">
          <v-card flat width="100%" class="">
            <v-card-title class="text-h5 primary--text pb-2">
              {{ settings.appName.label }}
            </v-card-title>
            <v-card-text class="d-flex flex-column align-start">
              {{ settings.appName.description }}
              <v-text-field type="text" v-model="name"></v-text-field>
            </v-card-text>
          </v-card>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-btn color="success" :disabled="actionDisabled" :loading="loadingSave" tile width="150" @click="saveSettings">SAVE</v-btn>
          <v-btn color="warning" :disabled="actionDisabled" tile @click="revertSettings">REVERT </v-btn>
        </v-card-actions>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'SettingGeneral',
    components: {},
    data: () => ({
      currentSettings: {
        appName: null,
      },
      loadingSave: false,
    }),
    computed: {
      actionDisabled() {
        const settings = {
          appName: this.name,
        }
        const isChanged = JSON.stringify(settings) === JSON.stringify(this.currentSettings)
        return isChanged || this.loadingSave
      },
      name: {
        get() {
          return this.settings.appName.value
        },
        set(v) {
          this.$store.dispatch('settingsSet', { appName: v })
        },
      },
      settings() {
        return this?.$store?.getters?.settingsByCat?.app || {}
      },
    },
    methods: {
      revertSettings() {
        this.$store.dispatch('settingsSet', this.currentSettings)
      },
      async saveSettings() {
        this.loadingSave = true
        const propsData = null
        const resp = await this.$store.dispatch('apiPost', { endpoint: 'manage/settings/app', postData })
        if (resp.status === 'success') {
        }
        //dispatch sb
        this.loadingSave = false
        this.$store.dispatch('snackbar', {})
        console.log(resp)
      },
    },
    created() {
      this.currentSettings.appName = this.settings.appName.value
    },
  }
</script>

<style lang="scss" scoped>
  .test {
    position: sticky;
    top: 80px;
  }
</style>
