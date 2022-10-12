<script>
import Colorpicker from '@/components/Controls/PickerColor'

export default {
  name: 'SettingsGeneral',
  components: {
    Colorpicker,
  },
  data: () => ({
    actionLoading: false,
    color: null,
    colorMode: 'color',
    colorModeOptions: [
      { value: 'color', disabled: false, text: 'Color' },
      { value: 'dynamic', disabled: true, text: 'Dynamic' },
    ],
    originalSettings: {
      color: null,
      timeout: null,
    },
    timeout: null,
  }),
  computed: {
    boardSettings() {
      return this?.$store?.getters?.settingsByCat?.board || {}
    },
    timeoutDisplayed: {
      get() {
        return Math.floor(this.timeout / 1000)
      },
      set(v) {
        this.timeout = Math.floor(v * 1000)
      },
    },
  },
  methods: {
    settingsRevert() {
      this.colorMode =
        this.originalSettings.color === 'dynamic' ? 'dynamic' : 'color'
      this.color = this.originalSettings.color
      this.timeout = this.originalSettings.timeout
    },
    async settingsSave() {
      this.actionLoading = true
      await this.$store.dispatch('settingsSet', { boardBackground: this.color })
      await this.$store.dispatch('settingsSet', {
        boardItemTimeout: this.timeout,
      })
      //DEMO
      this.$store.dispatch('boardSettingSet', {
        board: { boardBackground: this.color, boardItemTimeout: this.timeout },
      })
      this.$store.dispatch('boardSettingsSave')
      this.actionLoading = false
      this.$store.dispatch('snackbar', {
        color: 'success',
        message: 'Settings updated.',
        value: true,
      })
    },
    colorSet(val) {
      this.color = val.hexa ?? val
    },
    onSelect(val) {
      this.color =
        val === 'dynamic'
          ? val
          : this.boardSettings.boardBackground.value === 'dynamic'
          ? '#FF0000FF'
          : this.boardSettings.boardBackground.value
    },
  },
  created() {
    this.color = this.boardSettings.boardBackground.value
    this.originalSettings.color = this.color
    this.timeout = this.boardSettings.boardItemTimeout.value
    this.originalSettings.timeout = this.timeout
  },
}
</script>
<template>
  <v-card outlined class="">
    <v-card-title class="text-h4 primary--text">
      General
    </v-card-title>
    <v-card-text class="d-flex flex-column align-start">
      <v-card flat class="">
        <v-card-title class="text-h5 primary--text">
          {{ boardSettings.boardBackground.label }}
        </v-card-title>
        <v-card-text class="d-flex flex-column align-start">
          <p class="">
            {{ boardSettings.boardBackground.description }}
          </p>
          <v-select
            color
            v-model="colorMode"
            :items="colorModeOptions"
            :messages="
              colorMode === 'color'
                ? 'Set a static color'
                : 'The active image\'s dominant color will be used.'
            "
            @input="onSelect"
          ></v-select>

          <v-sheet
            class="d-flex align-center justify-space-around mt-4"
            v-if="colorMode === 'color'"
          >
            <Colorpicker
              @input="colorSet"
              :btnProps="{
                color,
                label: '     ',
                value: color,
                class: { 'mt-6': true },
              }"
            ></Colorpicker>
          </v-sheet>
        </v-card-text>
      </v-card>
      <v-card flat width="100%" class="">
        <v-card-title class="text-h5 primary--text pb-2">
          {{ boardSettings.boardItemTimeout.label }}
        </v-card-title>
        <v-card-text class="d-flex flex-column align-start">
          <p>{{ boardSettings.boardItemTimeout.description }}</p>
          <v-text-field
            v-model="timeoutDisplayed"
            color="primary"
            :rules="[(v) => v && v >= 1]"
            messages="Enter 1 or more seconds"
            min="2"
            type="number"
            prepend-inner-icon="mdi-counter"
          ></v-text-field>
        </v-card-text>
      </v-card>
    </v-card-text>
    <v-card-actions class="pa-4">
      <v-btn
        tile
        color="success"
        :disabled="
          boardSettings.boardBackground.value === color &&
            boardSettings.boardItemTimeout.value === timeout
        "
        width="150"
        @click="settingsSave"
        >SAVE
      </v-btn>
      <v-btn
        tile
        color="warning"
        :disabled="
          boardSettings.boardBackground.value === color || actionLoading
        "
        @click="settingsRevert"
        >REVERT
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
