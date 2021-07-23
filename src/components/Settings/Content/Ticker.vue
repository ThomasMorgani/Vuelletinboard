<template>
  <v-card outlined class="" v-if="!loading">
    <v-card-title class="text-h4 primary--text">
      Ticker
    </v-card-title>
    <v-card-text class="d-flex flex-column align-start">
      <v-card flat width="100%" class="">
        <v-card-title class="text-h5 primary--text">
          {{ tickerSettings.tickerShow.label }}
        </v-card-title>
        <v-card-text class="d-flex flex-column align-start">
          <p>{{ tickerSettings.tickerShow.description }}</p>
          <v-switch color v-model="show" :prepend-icon="show ? 'mdi-eye' : 'mdi-eye-off'" class="mt-0"> </v-switch>
        </v-card-text>
      </v-card>
      <v-card :disabled="loading || !show" flat width="100%" class="">
        <v-card-title class="text-h5 primary--text pb-2">
          {{ tickerSettings.tickerColor.label }}
        </v-card-title>
        <v-card-text class="d-flex flex-column align-start">
          <p>{{ tickerSettings.tickerColor.description }}</p>
          <Colorpicker @input="setColor" :btnProps="{ color: color, label: '     ', value: color }"></Colorpicker>
        </v-card-text>
      </v-card>
      <v-card flat width="100%" class="" :disabled="loading || !show">
        <v-card-title class="text-h5 primary--text">
          {{ tickerSettings.tickerFeed.label }}
        </v-card-title>
        <v-card-text class="d-flex flex-column align-start">
          <p>{{ tickerSettings.tickerFeed.description }}</p>
          <v-select color v-model="feed" :items="feedOptions" item-text="label" item-value="id">
            <template #append-outer>
              <v-btn small icon color="primary" :href="feedUrl()" target="_blank">
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
            </template>
          </v-select>
        </v-card-text>
      </v-card>
      <v-card :disabled="loading || !show" flat width="100%" class="">
        <v-card-title class="text-h5 primary--text">
          {{ tickerSettings.tickerFilter.label }}
        </v-card-title>
        <v-card-text class="d-flex flex-column align-start">
          <p>{{ tickerSettings.tickerFilter.description }}</p>
          <v-combobox
            v-model="filter"
            @change="filterFormat"
            chips
            clearable
            color="primary"
            deletable-chips
            full-width
            :items="[...filterKeywords, ...filter]"
            item-color="primary"
            multiple
          >
            <template #selection="data">
              <v-chip color="primary" close :key="JSON.stringify(data.item)" v-bind="data.attrs" :input-value="data.selected" @click:close="filterRemoveItem(data.item)">
                {{ data.item }}
              </v-chip>
            </template>
            <template #append-outer>
              <v-menu v-model="filterDefaultsMenu" :close-on-click="false" :close-on-content-click="false" offset-x>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" icon v-bind="attrs" v-on="on">
                    <v-icon color="">mdi-filter-variant-plus</v-icon>
                  </v-btn>
                </template>

                <v-card width="400">
                  <v-card-title class="d-flex flex-column align-start">
                    <p class="text-h5 primary--text pa-0 ma-0">Recommended filters</p>
                    <p class="text-caption pa-0 ma-0">For: {{ feedOptions.find(f => f.id == feed).label || '' }}</p>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text class="d-flex align-start justify-start">
                    <p v-if="!filterDefaults">There are no recommended filters for this feed.</p>
                    <v-tooltip v-for="filter in filterDefaults" :key="filter.text" color="primary" :disabled="!filter.disabled" top>
                      <template v-slot:activator="{ attrs, on }">
                        <div v-bind="attrs" v-on="on">
                          <v-chip
                            close
                            close-icon="mdi-plus-circle"
                            close-label="Add"
                            color="primary"
                            @click:close="filterAddItem(filter.text)"
                            :disabled="filter.disabled"
                            class="mr-2"
                          >
                            {{ filter.text }}
                          </v-chip>
                        </div>
                      </template>
                      <span>Already added</span>
                    </v-tooltip>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="primary" :disabled="filterAddAllDisabled" text @click="filterAddItemMany(filterDefaults)">
                      <v-icon left>mdi-plus</v-icon>
                      ADD ALL
                    </v-btn>
                    <v-spacer></v-spacer>

                    <v-btn color="error" text @click="filterDefaultsMenu = false">
                      CLOSE
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </template>
          </v-combobox>
        </v-card-text>
      </v-card>
      <v-card :disabled="loading || !show" flat width="100%" class="">
        <v-card-title class="text-h5 primary--text pb-2">
          {{ tickerSettings.tickerHeight.label }}
        </v-card-title>
        <v-card-text class="d-flex flex-column align-start">
          <p>{{ tickerSettings.tickerHeight.description }}</p>
          <v-text-field v-model="height" color="primary" type="number" min="0" @input="setHeight"></v-text-field>
        </v-card-text>
      </v-card>
      <v-card :disabled="loading || !show" flat width="100%" class="">
        <v-card-title class="text-h5 primary--text">
          {{ tickerSettings.tickerSpeed.label }}
        </v-card-title>
        <v-card-text class="d-flex flex-column align-start">
          <p>{{ tickerSettings.tickerSpeed.description }}</p>
          <v-sheet color="transparent" width="50%" class="mt-4">
            <v-slider v-model="speed" color="primary" :max="6" :min="1" :step="1" thumb-color="primary" thumb-label="always" ticks="always" @change="setSpeed">
              <template #append>fast</template>
              <template #prepend>slow</template>
            </v-slider>
          </v-sheet>
        </v-card-text>
      </v-card>
      <v-card :disabled="loading || !show" flat width="100%" class="">
        <v-card-title class="text-h5 primary--text pb-2">
          {{ tickerSettings.tickerTextColor.label }}
        </v-card-title>
        <v-card-text class="d-flex flex-column align-start">
          <p>{{ tickerSettings.tickerTextColor.description }}</p>
          <Colorpicker @input="setTextColor" :btnProps="{ color: textColor, label: '     ', value: textColor }"></Colorpicker>
        </v-card-text>
      </v-card>
    </v-card-text>
    <v-card-actions class="pa-4">
      <v-btn tile color="success" :disabled="actionDisabled" width="150" @click="saveTicker">SAVE </v-btn>
      <v-btn tile color="warning" :disabled="actionDisabled" @click="revertSettings">REVERT </v-btn>
      <v-spacer></v-spacer>
      <v-btn tile :color="tickerPreview ? 'primary' : 'disabled'" @click="toggleTicker" class="font-weight-bold ">
        <v-icon left>{{ `mdi-${tickerPreview ? 'eye' : 'eye-off'}` }}</v-icon
        >PREVIEW
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import Colorpicker from '@/components/Controls/PickerColor'

  export default {
    name: 'SettingTicker',
    components: { Colorpicker },
    data: () => ({
      color: null,
      currentSettings: {
        color: null,
        feed: null,
        filter: null,
        height: null,
        show: null,
        speed: null,
        textColor: null,
      },
      feed: null,
      feedOptions: [],
      // feedOptions: [
      //   {
      //     id: 1,
      //     text: 'ABC NEWS',
      //     value: 'https://abcnews.go.com/abcnews/topstories',
      //   },
      // ],
      filter: [],
      filterDefaultsMenu: false,
      filterKeywords: [],
      height: null,
      loading: true,
      loadingSave: false,
      show: true,
      speed: 1,
      textColor: null,
    }),
    computed: {
      actionDisabled() {
        const settings = {
          color: this.color,
          feed: this.feed,
          filter: JSON.stringify(this.filter),
          height: this.height,
          show: this.show,
          speed: +this.speed,
          textColor: this.textColor,
        }
        const isChanged = JSON.stringify(settings) === JSON.stringify({ ...this.currentSettings, filter: JSON.stringify(this.currentSettings.filter) })
        return isChanged || this.loadingSave
      },
      filterAddAllDisabled() {
        let availableFilters = true
        this.filterDefaults.forEach(df => {
          if (this.filter.indexOf(df.text) < 0) availableFilters = false
        })
        return availableFilters
      },
      filterDefaults() {
        const defaultFilters = this.feedOptions.find(f => f.id == this.feed).filter || []
        const filters = defaultFilters.map(f => ({ text: f, disabled: this.filter.indexOf(f.toUpperCase()) > -1 }))
        return filters
      },
      filterAutocomplete() {},
      tickerPreview() {
        return this.$store?.state?.ticker?.tickerPreview || false
      },
      tickerSettings() {
        return this?.$store?.getters?.settingsByCat?.ticker || {}
      },
    },
    methods: {
      feedUrl() {
        return '#'
        //feedOptions.find(f => f.id === feed).value
      },
      filterAddItem(filter) {
        this.filter = [...this.filter, filter]
        this.filterFormat()
      },
      filterAddItemMany(filters = []) {
        filters.forEach(f => (this.filter = [...this.filter, f.text ? f.text : f]))
        this.filterFormat()
      },
      filterFormat() {
        const filter = this.filter.map(i => i.toUpperCase()).sort((a, b) => a > b)
        this.filter = Array.from(new Set(filter))
        const keywords = [...this.filterKeywords, ...filter].map(i => i.toUpperCase()).sort((a, b) => a > b)
        this.filterKeywords = Array.from(new Set(keywords))
      },
      filterRemoveItem(item) {
        this.filter = [...this.filter.filter(i => i !== item)]
      },
      revertSettings() {
        const currentSettings = {
          color: this.tickerSettings.tickerColor.value,
          feed: this.tickerSettings.tickerFeed.value,
          filter: this.tickerSettings.tickerFilter.value || [],
          height: this.tickerSettings.tickerHeight.value,
          show: this.tickerSettings.tickerShow.value,
          speed: +this.tickerSettings.tickerSpeed.value,
          textColor: this.tickerSettings.tickerTextColor.value,
        }
        for (let setting in currentSettings) {
          this[setting] = currentSettings[setting]
        }
        // this.setUnit()
        this.currentSettings = { ...currentSettings }
      },
      async saveTicker() {
        console.log('saveHeader')
        const postData = {
          tickerColor: this.color,
          tickerFeed: this.feed,
          tickerFilter: JSON.stringify(this.filter),
          tickerHeight: this.height,
          tickerShow: this.show,
          tickerText: this.speed,
          tickerTextColor: this.textColor,
        }
        this.loadingSave = true
        const resp = await this.$store.dispatch('apiPost', { endpoint: 'manage/settings/ticker', postData })
        if (resp.status === 'success') {
          this.$store.dispatch('settingsSet', postData)
          this.revertSettings()
        }
        this.loadingSave = false
        const { status: color, message } = resp
        this.$store.dispatch('snackbar', { color, message, value: true })
      },
      setColor(e = null) {
        this.color = e.hexa || e
        this.$store.dispatch('tickerSet', { ...this.$store.state.ticker, tickerColor: this.color })
      },
      setHeight(e) {
        console.log(e)
        this.$store.dispatch('tickerSet', { ...this.$store.state.ticker, tickerHeight: this.height })
      },
      setSpeed(e) {
        this.$store.dispatch('tickerSet', { ...this.$store.state.ticker, tickerSpeed: this.speed })
      },
      setTextColor(e = null) {
        this.textColor = e.hexa || e
        this.$store.dispatch('tickerSet', { ...this.$store.state.ticker, tickerTextColor: this.textColor })
      },

      toggleTicker() {
        const ticker = {
          tickerColor: this.color,
          tickerFeed: this.feed,
          tickerFilter: this.filter,
          tickerImage: this.height,
          tickerRss: this.feedOptions.find(f => f.id === this.feed).rss,
          tickerShow: this.show,
          tickerSpeed: this.speed,
          tickerTextColor: this.textColor,
        }
        this.$store.dispatch('tickerSet', { ...ticker, tickerPreview: !this.tickerPreview })
      },
    },
    created() {},
    async mounted() {
      const data = await this.$store.dispatch('apiGet', 'manage/settings/feed')
      this.feedOptions = data?.feedOptions ? data.feedOptions.map(o => ({ ...o, filter: JSON.parse(o.filter) })) : []
      this.filterKeywords = data?.filterKeywords ? [...data.filterKeywords] : []
      this.revertSettings()
      this.loading = false
    },
  }
</script>

<style lang="scss" scoped>
  .v-input {
    width: 600px;
  }
</style>
