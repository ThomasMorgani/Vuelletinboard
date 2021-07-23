<template>
  <v-card outlined class="" ref="settingItem">
    <Eventlist v-if="itemlistPreview" class="eventList" sheetHeight="40em"></Eventlist>
    <v-card-title class="text-h4 primary--text">
      Item list
    </v-card-title>
    <v-card-text class="d-flex flex-column align-start">
      <v-sheet color="transparent" class="d-flex">
        <!-- inactive card colors -->
        <v-sheet color="transparent" class="d-flex flex-column align-start">
          <v-card flat class="">
            <v-card-title class="text-h5 primary--text">
              {{ itemSettings.itemColor.label }}
            </v-card-title>
            <v-card-text class="d-flex flex-column align-start">
              <p>{{ itemSettings.itemColor.description }}</p>
              <Colorpicker @input="setItem('color', 'itemColor', $event)" :btnProps="{ color: color }"></Colorpicker>
            </v-card-text>
          </v-card>

          <v-card flat class="">
            <v-card-title class="text-h5 primary--text">
              {{ itemSettings.itemTextTitle.label }}
            </v-card-title>
            <v-card-text class="d-flex flex-column align-start">
              <p>{{ itemSettings.itemTextTitle.description }}</p>
              <Colorpicker @input="setItem('title', 'itemTextTitle', $event)" :btnProps="{ color: title }"></Colorpicker>
            </v-card-text>
          </v-card>

          <v-card flat class="">
            <v-card-title class="text-h5 primary--text">
              {{ itemSettings.itemTextSubtitle.label }}
            </v-card-title>
            <v-card-text class="d-flex flex-column align-start">
              <p>{{ itemSettings.itemTextSubtitle.description }}</p>
              <Colorpicker @input="setItem('subtitle', 'itemTextSubtitle', $event)" :btnProps="{ color: subtitle }"></Colorpicker>
            </v-card-text>
          </v-card>
          <v-card flat class="">
            <v-card-title class="text-h5 primary--text">
              {{ itemSettings.itemTextDescription.label }}
            </v-card-title>
            <v-card-text class="d-flex flex-column align-start">
              <p>{{ itemSettings.itemTextDescription.description }}</p>
              <Colorpicker @input="setItem('description', 'itemTextDescription', $event)" :btnProps="{ color: description }"></Colorpicker>
            </v-card-text>
          </v-card>
          <v-card flat class="">
            <v-card-title class="text-h5 primary--text">
              {{ itemSettings.itemTextFooter.label }}
            </v-card-title>
            <v-card-text class="d-flex flex-column align-start">
              <p>{{ itemSettings.itemTextFooter.description }}</p>
              <Colorpicker @input="setItem('footer', 'itemTextFooter', $event)" :btnProps="{ color: footer }"></Colorpicker>
            </v-card-text>
          </v-card>
        </v-sheet>
        <!-- active card colors -->
        <v-sheet color="transparent" class="d-flex flex-column align-start ml-4">
          <v-card flat class="">
            <v-card-title class="text-h5 primary--text">
              {{ itemSettings.itemColorActive.label }}
            </v-card-title>
            <v-card-text class="d-flex flex-column align-start">
              <p>{{ itemSettings.itemColorActive.description }}</p>
              <Colorpicker @input="setItem('colorActive', 'itemColorActive', $event)" :btnProps="{ color: colorActive }"></Colorpicker>
            </v-card-text>
          </v-card>
          <v-card flat class="">
            <v-card-title class="text-h5 primary--text">
              {{ itemSettings.itemTextTitleActive.label }}
            </v-card-title>
            <v-card-text class="d-flex flex-column align-start">
              <p>{{ itemSettings.itemTextTitleActive.description }}</p>
              <Colorpicker @input="setItem('titleActive', 'itemTextTitleActive', $event)" :btnProps="{ color: titleActive }"></Colorpicker>
            </v-card-text>
          </v-card>
          <v-card flat class="">
            <v-card-title class="text-h5 primary--text">
              {{ itemSettings.itemTextSubtitleActive.label }}
            </v-card-title>
            <v-card-text class="d-flex flex-column align-start">
              <p>{{ itemSettings.itemTextSubtitleActive.description }}</p>
              <Colorpicker @input="setItem('subtitleActive', 'itemTextSubtitleActive', $event)" :btnProps="{ color: subtitleActive }"></Colorpicker>
            </v-card-text>
          </v-card>
          <v-card flat class="">
            <v-card-title class="text-h5 primary--text">
              {{ itemSettings.itemTextDescriptionActive.label }}
            </v-card-title>
            <v-card-text class="d-flex flex-column align-start">
              <p>{{ itemSettings.itemTextDescriptionActive.description }}</p>
              <Colorpicker @input="setItem('descriptionActive', 'itemTextDescriptionActive', $event)" :btnProps="{ color: descriptionActive }"></Colorpicker>
            </v-card-text>
          </v-card>
          <v-card flat class="">
            <v-card-title class="text-h5 primary--text">
              {{ itemSettings.itemTextFooterActive.label }}
            </v-card-title>
            <v-card-text class="d-flex flex-column align-start">
              <p>{{ itemSettings.itemTextFooterActive.description }}</p>
              <Colorpicker @input="setItem('footerActive', 'itemTextFooterActive', $event)" :btnProps="{ color: footerActive }"></Colorpicker>
            </v-card-text>
          </v-card>
        </v-sheet>
      </v-sheet>
      <v-card flat width="100%" class="">
        <v-card-title class="text-h5 primary--text pb-2">
          {{ itemSettings.itemListHeaderText.label }}
        </v-card-title>
        <v-card-text class="d-flex flex-column align-start">
          <p>{{ itemSettings.itemListHeaderText.description }}</p>
          <v-text-field
            v-model="headerText"
            color="primary"
            messages="Enter display text"
            prepend-inner-icon="mdi-format-text"
            @input="setItem('headerText', 'itemListHeaderText', $event)"
          ></v-text-field>
        </v-card-text>
      </v-card>
      <v-card flat class="">
        <v-card-title class="text-h5 primary--text">
          {{ itemSettings.itemListHeaderColor.label }}
        </v-card-title>
        <v-card-text class="d-flex flex-column align-start">
          <p>{{ itemSettings.itemListHeaderColor.description }}</p>
          <Colorpicker @input="setItem('headerColor', 'itemListHeaderColor', $event)" :btnProps="{ color: headerColor }"></Colorpicker>
        </v-card-text>
      </v-card>
      <v-card flat class="">
        <v-card-title class="text-h5 primary--text">
          {{ itemSettings.itemListHeaderTextColor.label }}
        </v-card-title>
        <v-card-text class="d-flex flex-column align-start">
          <p>{{ itemSettings.itemListHeaderTextColor.description }}</p>
          <Colorpicker @input="setItem('headerTextColor', 'itemListHeaderTextColor', $event)" :btnProps="{ color: headerTextColor }"></Colorpicker>
        </v-card-text>
      </v-card>
    </v-card-text>
    <v-card-actions class="pa-4">
      <v-btn tile color="success" :disabled="actionDisabled" width="150" @click="saveItemSettings">SAVE </v-btn>
      <v-btn tile color="warning" :disabled="actionDisabled" @click="revertSettings">REVERT </v-btn>
      <v-spacer></v-spacer>
      <v-btn tile :color="itemlistPreview ? 'primary' : 'disabled'" @click="toggleItemlistPreview" class="font-weight-bold ">
        <v-icon left>{{ `mdi-${itemlistPreview ? 'eye' : 'eye-off'}` }}</v-icon
        >PREVIEW
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import Colorpicker from '@/components/Controls/PickerColor'
  import Eventlist from '@/components/Bulletinboard/Eventlist'
  export default {
    name: 'SettingsItem',
    components: { Colorpicker, Eventlist },
    data: () => ({
      currentSettings: {
        color: null,
        colorActive: null,
        description: null,
        descriptionActive: null,
        footer: null,
        footerActive: null,
        headerColor: null,
        headerText: null,
        headerTextColor: null,
        subtitle: null,
        subtitleActive: null,
        timeout: null,
        title: null,
        titleActive: null,
      },
      color: null,
      colorActive: null,
      description: null,
      descriptionActive: null,
      footer: null,
      footerActive: null,
      headerColor: null,
      headerText: null,
      headerTextColor: null,
      itemlistPreview: false,
      loadingSave: false,
      metric: 'seconds',
      metricOptions: ['seconds', 'minutes', 'hours'],
      subtitle: null,
      subtitleActive: null,
      timout: null,
      title: null,
      titleActive: null,
    }),
    computed: {
      actionDisabled() {
        const settings = this.formatWorkingSettings()
        const isChanged = JSON.stringify(settings) === JSON.stringify(this.currentSettings)
        return isChanged || this.loadingSave
      },
      itemSettings() {
        return this?.$store?.getters?.settingsByCat?.item || {}
      },
      // timeout: {
      //   get() {
      //     return this.fromMilliseconds(this.itemTimeout.value)
      //   },
      //   set(e) {
      //     this.$emit('input', { setting: 'itemTimeout', value: this.toMilliseconds(e.target.value) })
      //   },
      // },
    },
    methods: {
      fromMilliseconds(val) {
        switch (this.metric) {
          case 'seconds':
            return val / 1000
            break
          case 'minutes':
            return val < 60000 ? 0 : val / 60 / 1000
            break
          case 'hours':
            return val < 3600000 ? 0 : val / 60 / 60 / 1000
            break
        }
      },
      formatCurrentSettings() {
        return {
          color: this.itemSettings.itemColor.value,
          colorActive: this.itemSettings.itemColorActive.value,
          description: this.itemSettings.itemTextDescription.value,
          descriptionActive: this.itemSettings.itemTextDescriptionActive.value,
          footer: this.itemSettings.itemTextFooter.value,
          footerActive: this.itemSettings.itemTextFooterActive.value,
          headerColor: this.itemSettings.itemListHeaderColor.value,
          headerText: this.itemSettings.itemListHeaderText.value,
          headerTextColor: this.itemSettings.itemListHeaderTextColor.value,
          subtitle: this.itemSettings.itemTextSubtitle.value,
          subtitleActive: this.itemSettings.itemTextSubtitleActive.value,
          timeout: this.itemSettings.itemTimeout.value,
          title: this.itemSettings.itemTextTitle.value,
          titleActive: this.itemSettings.itemTextTitleActive.value,
        }
      },
      formatItemSettings() {
        const data = {
          itemColor: this.color,
          itemColorActive: this.colorActive,
          itemListHeaderColor: this.headerColor,
          itemListHeaderText: this.headerText,
          itemListHeaderTextColor: this.headerTextColor,
          itemTextDescription: this.description,
          itemTextDescriptionActive: this.descriptionActive,
          itemTextFooter: this.footer,
          itemTextFooterActive: this.footerActive,
          itemTextSubtitle: this.subtitle,
          itemTextSubtitleActive: this.subtitleActive,
          itemTextTitle: this.title,
          itemTextTitleActive: this.titleActive,
          itemTimeout: '7000',
        }
        return data
      },
      formatWorkingSettings() {
        const data = {
          color: this.color,
          colorActive: this.colorActive,
          description: this.description,
          descriptionActive: this.descriptionActive,
          footer: this.footer,
          footerActive: this.footerActive,
          headerColor: this.headerColor,
          headerText: this.headerText,
          headerTextColor: this.headerTextColor,
          subtitle: this.subtitle,
          subtitleActive: this.subtitleActive,
          timeout: this.timeout,
          title: this.title,
          titleActive: this.titleActive,
        }

        return data
      },
      revertSettings() {
        const currentSettings = this.formatCurrentSettings()

        for (let setting in currentSettings) {
          this[setting] = currentSettings[setting]
        }

        this.currentSettings = { ...currentSettings }
        const settingsItem = this.formatItemSettings()
        this.$store.dispatch('itemSet', { ...this.$store.state.item, ...settingsItem })
      },
      async saveItemSettings() {
        console.log('saveItemSettings')
        const postData = this.formatItemSettings()
        this.loadingSave = true
        const resp = await this.$store.dispatch('apiPost', { endpoint: 'manage/settings/item', postData })
        if (resp.status === 'success') {
          this.$store.dispatch('settingsSet', postData)
          this.revertSettings()
        }
        this.loadingSave = false
        const { status: color, message } = resp
        this.$store.dispatch('snackbar', { color, message, value: true })
      },
      setItem(item, itemSetting, val) {
        this[item] = val
        this.$store.dispatch('itemSet', { ...this.$store.state.item, [itemSetting]: val })
      },
      setUnit() {
        const timeout = this.timeout
        switch (true) {
          case timeout < 60000:
            this.metric = 'seconds'
            break
          case timeout >= 60000 && time < 3600000:
            this.metric = 'minutes'
            break
          case timeout >= 3600000:
            this.metric = 'hours'
            break
          default:
            break
        }
      },
      toggleItemlistPreview() {
        const items = [
          {
            content_date: '1999-09-19 19:19:19',
            content_desc: 'Description text for active item',
            content_media: '',
            content_media_type: '',
            content_subtitle: 'Active item subtitle',
            content_title: 'Active item title',
            content_type: '',
            created_by: '',
            created_on: '',
            id: 1,
            updated_by: '',
            updated_on: '',
            visible: true,
          },
          {
            content_date: '1999-09-19 19:19:19',
            content_desc: 'Description text for item',
            content_media: '',
            content_media_type: '',
            content_subtitle: 'Item subtitle',
            content_title: 'Item title',
            content_type: '',
            created_by: '',
            created_on: '',
            id: 2,
            updated_by: '',
            updated_on: '',
            visible: true,
          },
        ]

        const settings = this.formatItemSettings()
        // this.$store.dispatch('itemSet', { ...this.$store.state.item, ...settings })
        this.$store.dispatch('itemsSet', items)
        this.itemlistPreview = !this.itemlistPreview
        if (this.itemlistPreview) {
          this.$refs.settingItem.$el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
          setTimeout(() => {
            document.querySelector('html').scrollTop -= 150
          }, 800)
        }
      },
      toMilliseconds(val) {
        switch (this.metric) {
          case 'seconds':
            return val * 1000
            break
          case 'minutes':
            return val * 60 * 1000
            break
          case 'hours':
            return val * 60 * 60 * 1000
            break
        }
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
  .eventList {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }
</style>
