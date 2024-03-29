<template>
  <v-sheet :color="settings.boardBackground" height="100%" ref="contentSheet" width="100%" class="contentSheet d-flex flex-no-wrap align-start justify-start">
    <!--EVENT LIST -->
    <EventList v-if="!isLoading" @showNext="itemNext" @showPrevious="itemPrevious" @selectItem="itemSelect"></EventList>
    <!--IMAGE -->
    <transition name="fade" mode="out-in">
      <EventImage :key="displayedEventImage" :image="displayedEventImage" class="d-flex flex-grow-1 flex-shrink-0"></EventImage>
    </transition>
  </v-sheet>
</template>

<script>
  // import { seedData } from '@/assets/store/data.js'
  // const { items: itemsData, settings: appSettings } = seedData
  import { mapState } from 'vuex'

  import EventList from '@/components/Bulletinboard/Eventlist'
  import EventImage from '@/components/Bulletinboard/Eventimage'

  export default {
    name: 'Bulletinboard',
    components: {
      EventList,
      EventImage,
    },
    data: () => ({
      activeEvent: 0,
      attrMainRow: {
        height: 0,
        width: 0,
      },
      intervalId: null,
      pollIntervalId: null,
      isLoading: true,
    }),
    computed: {
      ...mapState({
        items: state => state.items,
        header: state => state.header,
        settings: state => state.board,
        ticker: state => state.ticker,
      }),
      displayedEventImage() {
        return this.items?.['0']?.content_media
      },
    },
    methods: {
      async init() {
        await this.$store.dispatch('initBulletinboard')
        //IF ITEMS ,SETTINGS
        this.resetInterval(this.itemNext, this.settings.itemTimeout)
        this.isLoading = false
      },
      itemSelect(item) {
        const el = this.$el.getElementsByClassName('eventTop')[0]
        if (el) {
          el.scrollIntoView(true, { behavior: 'smooth' })
        }
        const items = [item, ...this.items.filter(i => i.id != item.id)]
        this.$store.dispatch('itemsSet', items)
        this.resetInterval(this.itemNext, this.settings.itemTimeout)
      },
      itemNext() {
        if (Array.isArray(this.items)) {
          const items = [...this.items]
          items.push(items.shift())
          this.$store.dispatch('itemsSet', items)
          this.resetInterval(this.itemNext, this.settings.itemTimeout)
        }
        return
      },
      itemPrevious() {
        if (Array.isArray(this.items)) {
          const items = [...this.items]
          items.unshift(items.pop())
          this.$store.dispatch('itemsSet', items)
          this.resetInterval(this.itemNext, this.settings.itemTimeout)
        }
        return
      },
      resetInterval(cb, time) {
        if (!cb || !time) {
          return
        }
        if (this.intervalId) {
          clearInterval(this.intervalId)
        }
        this.intervalId = setInterval(cb, time)
      },
      setHeight() {
        const defaults = {
          header: 80,
          ticker: 70,
        }
        const headerShow = this?.header?.boardHeaderShow ?? false
        const headerHeight = !headerShow ? 0 : this?.header?.boardHeaderHeight || defaults.header
        const tickerHeight = this?.ticker?.tickerHeight || defaults.ticker
        const adj = 5
        const diff = parseInt(headerHeight) + parseInt(tickerHeight) + adj
        const list = this.$refs.contentSheet.$el
        list.style.setProperty('height', `calc(100vh - ${diff}px)`)
      },
    },
    async created() {
      this.init()
    },
    beforeDestroy() {
      clearInterval(this.intervalId)
      clearInterval(this.pollIntervalId)
    },
    mounted() {
      setTimeout(this.setHeight, 500)
      const updateTimeout = 1000 * 60 * 10 //MOVE TO SETTINGS (curr 10min)
      this.pollIntervalId = setInterval(this.init, updateTimeout)
    },
  }
</script>

<style scoped>
  .contentSheet {
    overflow: hidden;
  }
  .fade-enter-active {
    transition: all 0.3s ease;
  }
  .fade-leave-active {
    transition: all 0.8s cubic-bezier(0.3, 0.5, 0.8, 1);
  }
  .fade-enter,
  .fade-leave-to {
    transform: translateY(15px);
    opacity: 0;
  }
</style>
