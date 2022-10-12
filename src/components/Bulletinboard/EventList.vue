<script>
  import { mapState } from 'vuex'
  import EventItem from '@/components/Bulletinboard/EventItem'

  export default {
    name: 'EventList',
    components: {
      EventItem,
    },
    props: {
      // items: {
      //   type: Array,
      //   required: true,
      // },
      sheetHeight: {
        type: [Number, String],
        required: false,
      },
    },
    data: () => ({
      listHeight: null,
      listWidth: null,
    }),
    computed: {
      ...mapState({
        header: state => state.boardSettings.header,
        settings: state => state.boardSettings.item,
        items: state => state.items,
        ticker: state => state.boardSettings.ticker,
      }),
      headerTextStyle() {
        return {
          color: this.settings.itemListHeaderTextColor,
        }
      },
    },
    methods: {
      setDimensions() {
        const list = this.$refs.itemList.$el
        if (this.sheetHeight) {
          list.style.setProperty('height', `${this.sheetHeight}`)
        }
        // list.style.setProperty('z-index', 1)
        this.listWidth = this.sheetWidth = list.clientWidth
        this.listHeight = this.sheetHeight || list.clientHeight
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
      this.setDimensions()
      //set dimensions
      //get width, pass has prop
    },
  }
</script>
<template>
  <v-sheet id="itemList" ref="itemList" color="transparent" v-resize="setDimensions" class="itemColumn d-flex flex-column justify-start  ma-1 pb-2">
    <v-card flat tile :color="settings.itemListHeaderColor" ref="eventListTitleCard" class="white--text ">
      <v-card-title class="d-flex justify-space-between headline py-2">
        <v-icon :color="settings.itemListHeaderTextColor" @click="$emit('showPrevious')">mdi-calendar-arrow-left</v-icon>
        <h4 class="text-h5" :style="headerTextStyle" v-text="settings.itemListHeaderText" @click="$store.dispatch('initBulletinboard')"></h4>
        <v-icon :color="settings.itemListHeaderTextColor" @click="$emit('showNext')">mdi-calendar-arrow-right</v-icon>
      </v-card-title>
    </v-card>
    <div group class="itemList">
      <v-sheet color="transparent" height="2" class="eventTop" v-if="items.length > 0"></v-sheet>
      <transition-group appear name="fade">
        <EventItem
          v-for="(item, idx) in items"
          :key="item.id"
          :id="`listItem${item.id}`"
          :item="item"
          :isActive="idx === 0"
          :listWidth="listWidth"
          @itemClicked="$emit('selectItem', item)"
          class="eventItem my-1"
        ></EventItem>
      </transition-group>
    </div>
  </v-sheet>
</template>
<style lang="scss" scoped>
  .itemColumn {
    height: 100%;
    width: 30vw;
    max-width: 450px;
    box-sizing: border-box;
    // z-index: 5;
  }

  .itemList {
    // height: calc(100vh - 225px); /* TODO: When all values in settings data, calc this is js*/
    overflow-y: scroll;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    z-index: 1;
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
