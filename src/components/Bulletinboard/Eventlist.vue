<template>
  <v-sheet id="itemList" ref="itemList" color="transparent" class="itemColumn d-flex flex-column justify-start  ma-1">
    <v-card flat tile :color="settings.itemListHeaderColor" ref="eventListTitleCard" class="white--text ">
      <v-card-title class="d-flex justify-space-between headline py-2">
        <v-icon :color="settings.itemListHeaderTextColor" @click="$emit('showPrevious')">mdi-calendar-arrow-left</v-icon>
        <h4 class="text-h5" :style="headerTextStyle" v-text="settings.itemListHeaderText"></h4>
        <v-icon :color="settings.itemListHeaderTextColor" @click="$emit('showNext')">mdi-calendar-arrow-right</v-icon>
      </v-card-title>
    </v-card>
    <div group class="itemList">
      <div class="eventTop" v-if="items.length > 0"></div>
      <transition-group appear name="fade">
        <EventItem
          v-for="(item, idx) in items"
          :key="item.id"
          :id="`listItem${item.id}`"
          :item="item"
          :isActive="idx === 0"
          @itemClicked="$emit('selectItem', item)"
          class="eventItem my-1"
        ></EventItem>
      </transition-group>
    </div>
  </v-sheet>
</template>

<script>
  import { mapState } from 'vuex'
  import EventItem from '@/components/Bulletinboard/Eventitem'

  export default {
    name: 'EventList',
    components: {
      EventItem,
    },
    props: ['sheetHeight'],
    computed: {
      ...mapState({
        header: state => state.header,
        settings: state => state.item,
        items: state => state.items,
        ticker: state => state.ticker,
      }),
      headerTextStyle() {
        return {
          color: this.settings.itemListHeaderTextColor,
        }
      },
    },
    methods: {
      setHeight() {
        const list = this.$refs.itemList.$el

        if (this.sheetHeight) {
          console.log(this.sheetHeight)
          list.style.setProperty('height', `${this.sheetHeight}`)
          list.style.setProperty('z-index', 1)
        }
        return
        // const defaults = {
        //   header: 80,
        //   ticker: 70,
        // }
        // const headerHeight = this?.header?.headerHeight || defaults.header
        // const tickerHeight = this?.ticker?.tickerHeight || defaults.ticker
        // const adj = 15
        // const diff = parseInt(headerHeight) + parseInt(tickerHeight) + adj
        // list.style.setProperty('height', `calc(100vh - ${diff}px)`)
      },
    },
    mounted() {
      this.setHeight()
    },
  }
</script>

<style lang="scss" scoped>
  .itemColumn {
    height: 100%;
    width: 30vw;
    max-width: 450px;
    box-sizing: border-box;
    z-index: 5;
  }

  .itemList {
    // height: calc(100vh - 225px); /* TODO: When all values in settings data, calc this is js*/
    overflow-y: scroll;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  .itemList::-webkit-scrollbar {
    display: none;
  }

  .eventItem {
    transition: all 2s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(80px);
  }

  .fade-leave-active {
    position: absolute;
    width: 30vw;
    z-index: 1;
    opacity: 0.5;
  }
</style>
