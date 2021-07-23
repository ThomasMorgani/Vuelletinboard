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
            v-model="mode"
            :items="modeOptions"
            :messages="mode === 'color' ? 'Set a static color' : 'The active image\'s dominant color will be used.'"
            @input="onSelect"
          ></v-select>

          <v-sheet class="d-flex align-center justify-space-around mt-4" v-if="mode === 'color'">
            <Colorpicker @input="colorSet" :btnProps="{ color, label: '     ', value: color, class: { 'mt-6': true } }"></Colorpicker>
          </v-sheet>
        </v-card-text>
      </v-card>
    </v-card-text>
    <v-card-actions class="pa-4">
      <v-btn tile color="success" :disabled="boardSettings.boardBackground.value === color" width="150" @click="colorSave">SAVE </v-btn>
      <v-btn tile color="warning" :disabled="boardSettings.boardBackground.value === color || actionLoading" @click="colorRevert">REVERT </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import Colorpicker from '@/components/Controls/PickerColor'

  export default {
    name: 'SettingBackground',
    components: {
      Colorpicker,
    },
    data: () => ({
      actionLoading: false,
      color: null,
      mode: 'color',
      modeOptions: ['color', 'dynamic'],
    }),
    computed: {
      boardSettings() {
        return this?.$store?.getters?.settingsByCat?.board || {}
      },
    },
    methods: {
      colorRevert() {
        this.mode = this.boardSettings.boardBackground.value === 'dynamic' ? 'dynamic' : 'color'
        this.color = this.boardSettings.boardBackground.value
      },
      async colorSave() {
        this.actionLoading = true
        const postData = {
          boardBackground: this.color,
        }
        const resp = await this.$store.dispatch('apiPost', { endpoint: 'manage/settings/board', postData })
        if (resp.status === 'success') {
        }
        //dispatch sb
        this.actionLoading = false
        this.$store.dispatch('snackbar', {
          color: resp.status || 'primary',
          message: resp.message || '',
          value: true,
        })
        console.log(resp)
      },
      colorSet(val) {
        this.color = val.hexa ?? val
      },
      onSelect(val) {
        this.color = val === 'dynamic' ? val : this.boardSettings.boardBackground.value === 'dynamic' ? '#FF0000FF' : this.boardSettings.boardBackground.value
      },
    },
    created() {
      this.color = this.boardSettings.boardBackground.value
    },
  }
</script>

<style lang="scss" scoped></style>
