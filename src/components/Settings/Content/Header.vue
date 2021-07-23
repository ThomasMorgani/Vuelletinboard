<template>
  <v-card outlined class="">
    <v-card-title class="text-h4 primary--text pb-2">
      Header
    </v-card-title>
    <v-card-text class="d-flex flex-column align-start">
      <v-card flat width="100%" class="">
        <v-card-title class="text-h5 primary--text pb-2">
          {{ boardSettings.boardHeaderShow.label }}
        </v-card-title>
        <v-card-text class="d-flex flex-column align-start">
          <p>{{ boardSettings.boardHeaderShow.description }}</p>
          <v-switch v-model="show" color hide-details :prepend-icon="show ? 'mdi-eye' : 'mdi-eye-off'" @change="toggleShow" class="mt-0"> </v-switch>
        </v-card-text>
      </v-card>
      <v-card :disabled="!show" flat width="100%" class="">
        <v-card-title class="text-h5 primary--text pb-2">
          {{ boardSettings.boardHeaderColor.label }}
        </v-card-title>
        <v-card-text class="d-flex flex-column align-start">
          <p>{{ boardSettings.boardHeaderColor.description }}</p>
          <Colorpicker @input="setColor" :btnProps="{ color: color, label: '     ', value: color }"></Colorpicker>
        </v-card-text>
      </v-card>
      <v-card :disabled="!show" flat width="100%" class="">
        <v-card-title class="text-h5 primary--text pb-2">
          {{ boardSettings.boardHeaderHeight.label }}
        </v-card-title>
        <v-card-text class="d-flex flex-column align-start">
          <p>{{ boardSettings.boardHeaderHeight.description }}</p>
          <v-text-field v-model="headerHeight" color="primary" type="number" min="0"></v-text-field>
        </v-card-text>
      </v-card>
      <v-card :disabled="!show" flat width="100%" class="">
        <v-card-title class="text-h5 primary--text pb-2">
          {{ boardSettings.boardHeaderType.label }}
        </v-card-title>
        <v-card-text class="d-flex flex-column align-start">
          <p>{{ boardSettings.boardHeaderType.description }}</p>
          <v-select color v-model="type" :items="typeOptions" :messages="type === 'text' ? 'Solid color with text.' : 'Select an image to use as a image.'" @change="setType">
          </v-select>
        </v-card-text>
      </v-card>
      <v-card v-if="type === 'image'" :disabled="!show" flat width="100%" class="">
        <v-card-title class="text-h5 primary--text pb-2">
          {{ boardSettings.boardHeaderText.label }}
        </v-card-title>
        <v-card-text class="d-flex flex-column align-start">
          <p>{{ boardSettings.boardHeaderText.description }}</p>
          <v-text-field v-model="image" color="primary" messages="Enter image url" prepend-inner-icon="mdi-link-variant"></v-text-field>
        </v-card-text>
      </v-card>
      <template v-if="type === 'text'">
        <v-card :disabled="!show" flat width="100%" class="">
          <v-card-title class="text-h5 primary--text pb-2">
            {{ boardSettings.boardHeaderText.label }}
          </v-card-title>
          <v-card-text class="d-flex flex-column align-start">
            <p>{{ boardSettings.boardHeaderText.description }}</p>
            <v-text-field v-model="headerText" color="primary" messages="Enter display text" prepend-inner-icon="mdi-format-text"></v-text-field>
          </v-card-text>
        </v-card>
        <v-card :disabled="!show" flat width="100%" class="">
          <v-card-title class="text-h5 primary--text pb-2">
            {{ boardSettings.boardHeaderTextColor.label }}
          </v-card-title>
          <v-card-text class="d-flex flex-column align-start">
            <p>{{ boardSettings.boardHeaderTextColor.description }}</p>

            <Colorpicker @input="setTextColor" :btnProps="{ color: textColor, label: '     ', value: textColor }"></Colorpicker>
          </v-card-text>
        </v-card>
      </template>
      <v-card :disabled="!show" flat width="100%" class="">
        <v-card-title class="text-h5 primary--text pb-2">
          {{ boardSettings.boardHeaderContentAlign.label }}
        </v-card-title>
        <v-card-text class="d-flex flex-column align-start">
          <p>{{ boardSettings.boardHeaderContentAlign.description }}</p>
          <v-select v-model="align" color="primary" :items="alignOptions" @change="setAlignment"></v-select>
        </v-card-text>
      </v-card>
    </v-card-text>
    <v-card-actions class="pa-4">
      <v-btn tile color="success" :disabled="actionDisabled" :loading="loadingSave" width="150" @click="saveHeader">SAVE </v-btn>
      <v-btn tile color="warning" :disabled="actionDisabled" @click="revertSettings">REVERT </v-btn>
      <v-spacer></v-spacer>
      <IconTooltip v-if="!show && preview" v-bind="{ iconOpts: { color: 'warning', left: true }, tooltipOpts: { text: 'Header is configured to be hidden' } }"></IconTooltip>
      <v-btn tile :color="preview ? 'primary' : 'disabled'" @click="togglePreview" class="font-weight-bold ">
        <v-icon left>{{ `mdi-${preview ? 'eye' : 'eye-off'}` }}</v-icon
        >PREVIEW
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import Colorpicker from '@/components/Controls/PickerColor'
  import IconTooltip from '@/components/Controls/IconTooltip'

  export default {
    name: 'SettingHeader',
    components: { Colorpicker, IconTooltip },
    data: () => ({
      align: 'start',
      alignOptions: ['start', 'center', 'end'],
      color: null,
      currentSettings: {
        align: null,
        color: null,
        text: null,
        image: null,
        show: null,
        type: null,
      },
      height: null,
      image: null,
      loadingSave: false,
      preview: false,
      show: true,
      text: null,
      textColor: null,
      type: 'text',
      typeOptions: ['image', 'text'],
    }),
    computed: {
      actionDisabled() {
        const settings = {
          align: this.align,
          color: this.color,
          height: this.height,
          image: this.image,
          show: this.show,
          text: this.text,
          textColor: this.textColor,
          type: this.type,
        }
        const isChanged = JSON.stringify(settings) === JSON.stringify(this.currentSettings)
        return isChanged || this.loadingSave
      },
      boardSettings() {
        return this?.$store?.getters?.settingsByCat?.board || {}
      },
      headerHeight: {
        get() {
          return this.height
        },
        set(v) {
          this.height = v
          this.$store.dispatch('headerSet', { ...this.$store.state.header, boardHeaderHeight: v })
        },
      },
      headerText: {
        get() {
          return this.text
        },
        set(v) {
          this.text = v
          this.$store.dispatch('headerSet', { ...this.$store.state.header, boardHeaderText: v })
        },
      },
    },
    methods: {
      formatHeaderSettings() {
        const data = {
          headerColor: this.color,
          headerContentAlign: this.align,
          headerHeight: this.height,
          headerImage: this.image,
          headerShow: this.show,
          headerText: this.text,
          headerTextColor: this.textColor,
          headerType: this.type,
        }
        return data
      },
      formatBoardHeaderSettings() {
        const data = {
          boardHeaderColor: this.color,
          boardHeaderContentAlign: this.align,
          boardHeaderHeight: this.height,
          boardHeaderImage: this.image,
          boardHeaderShow: this.show,
          boardHeaderText: this.text,
          boardHeaderTextColor: this.textColor,
          boardHeaderType: this.type,
        }
        return data
      },
      revertSettings() {
        const currentSettings = {
          align: this.boardSettings.boardHeaderContentAlign.value,
          color: this.boardSettings.boardHeaderColor.value,
          height: this.boardSettings.boardHeaderHeight.value,
          image: this.boardSettings.boardHeaderImage.value,
          show: this.boardSettings.boardHeaderShow.value,
          text: this.boardSettings.boardHeaderText.value,
          textColor: this.boardSettings.boardHeaderTextColor.value,
          type: this.boardSettings.boardHeaderType.value,
        }
        for (let setting in currentSettings) {
          this[setting] = currentSettings[setting]
        }
        this.currentSettings = { ...currentSettings }
        const settingsHeader = this.formatBoardHeaderSettings()
        this.$store.dispatch('headerSet', { ...this.$store.state.header, ...settingsHeader })
      },
      async saveHeader() {
        console.log('saveHeader')
        const postData = this.formatBoardHeaderSettings()
        this.loadingSave = true
        const resp = await this.$store.dispatch('apiPost', { endpoint: 'manage/settings/header', postData })
        if (resp.status === 'success') {
          this.$store.dispatch('settingsSet', postData)
          this.revertSettings()
        }
        this.loadingSave = false
        const { status: color, message } = resp
        this.$store.dispatch('snackbar', { color, message, value: true })
      },
      setAlignment(e) {
        this.align = e
        this.$store.dispatch('headerSet', { ...this.$store.state.header, boardHeaderContentAlign: this.align })
      },
      setColor(e) {
        this.color = e
        this.$store.dispatch('headerSet', { ...this.$store.state.header, boardHeaderColor: this.color })
      },
      setHeight() {
        this.$store.dispatch('headerSet', { ...this.$store.state.header, boardHeaderHeight: this.height })
      },
      setText() {
        this.$store.dispatch('headerSet', { ...this.$store.state.header, boardHeaderText: this.text })
      },
      setTextColor(e) {
        this.textColor = e
        this.$store.dispatch('headerSet', { ...this.$store.state.header, boardHeaderTextColor: this.textColor })
      },
      setType() {
        this.$store.dispatch('headerSet', { ...this.$store.state.header, boardHeaderType: this.type })
      },
      togglePreview() {
        this.preview = !this.preview

        const header = {
          boardHeaderContentAlign: this.align,
          boardHeaderColor: this.color,
          boardHeaderHeight: this.height,
          boardHeaderImage: this.image,
          boardHeaderShow: this.show,
          boardHeaderText: this.text,
          boardHeaderTextColor: this.textColor,
          boardHeaderType: this.type,
        }
        this.$store.dispatch('headerSet', { ...header, boardHeaderPreview: this.preview })
      },
      toggleShow(e) {
        this.show = e
        this.$store.dispatch('headerSet', { ...this.$store.state.header, boardHeaderShow: this.show })
      },
    },
    created() {
      this.revertSettings()
    },
  }
</script>

<style lang="scss" scoped>
  .v-input {
    width: 600px;
  }
</style>
