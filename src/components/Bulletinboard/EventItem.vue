<script>
  import { mapState } from 'vuex'
  import formats from '@/utils/formats'
  export default {
    name: 'eventItem',
    props: {
      item: {
        type: Object,
        default: () => {
          title: ''
        },
      },
      isActive: {
        type: Boolean,
        default: false,
      },
      listWidth: {
        type: [Number, String],
        required: false,
      },
    },
    computed: {
      ...mapState({
        appLoading: state => state.appLoading,
        settings: state => state.boardSettings.item,
      }),
      activeStyle() {
        // TODO: Add border option
        // const primary = this.$vuetify.theme.themes.light.primary
        // return {
        //   'border-right-color': primary,
        //   'border-right-width': '8px',
        // }
        return ''
      },
      descriptionStyle() {
        return {
          color: this.isActive ? this.settings.itemTextDescriptionActive : this.settings.itemTextDescription,
          'max-width': `${this.listWidth - 16}px` || null,
        }
      },
      footerStyle() {
        return {
          color: this.isActive ? this.settings.itemTextFooterActive : this.settings.itemTextFooter,
        }
      },
      // height() {

      //   return '160px'
      // },
      subtitleStyle() {
        return {
          color: this.isActive ? this.settings.itemTextSubtitleActive : this.settings.itemTextSubtitle,
        }
      },
      titleStyle() {
        return {
          color: this.isActive ? this.settings.itemTextTitleActive : this.settings.itemTextTitle,
          'max-width': `${this.listWidth - 16}px` || null,
        }
      },
      width() {
        return '100%'
      },
    },
    methods: {
      timestampToHuman(timestamp = '') {
        if (!timestamp) return ''
        const [date, time] = timestamp.split(' ')
        const dateHuman = formats.dateHuman(date)
        const timeHuman = formats.timeHuman(time)
        return `${dateHuman} ${timeHuman}`
      },
    },
    created() {},
  }
</script>
<template>
  <v-card
    :color="isActive ? settings.itemColorActive : settings.itemColor"
    :elevation="isActive ? '6' : '1'"
    height="160"
    :outlined="isActive"
    :width="width"
    max-width="450px"
    tile
    @click="$emit('itemClicked', item)"
    class="item d-flex flex-column"
    :style="isActive && activeStyle"
  >
    <v-card-title class="item-title-wrapper d-flex flex-column align-start justify-start flex-shrink-1 ">
      <h3 v-text="item.content_title" class="item-title text-left font-weight-bold  text-uppercase text-truncate  mb-0 pr-2" :style="titleStyle"></h3>
      <p v-text="item.content_subtitle" class="text-left  description pr-4 mb-0" :style="subtitleStyle"></p>
    </v-card-title>
    <v-card-text class="d-flex flex-column  flex-grow-1 align-start justify-space-between ">
      <p v-text="item.content_desc" class="description text-left font-italic text-body-1 mb-0 " :style="descriptionStyle"></p>
    </v-card-text>
    <v-card-actions class="text-body-2 font-weight-medium flex-shrink-1 px-4">
      <p v-text="timestampToHuman(item.content_date)" class="pa-0  ma-0 " :style="footerStyle"></p>
    </v-card-actions>
  </v-card>
</template>
<style lang="scss" scoped>
  .item {
    box-sizing: border-box;
    word-wrap: break-word;
    height: 160px;
    overflow: hidden;
  }

  .item-title {
    font-size: clamp(1rem, 1.3vw, 3rem);
    // font-size: 1em;
    // font-weight: normal;
    // letter-spacing: 0.009375em;
    // line-height: 1rem;
    // font-family: 'Roboto', sans-serif;
    // word-break: break-word;
  }
  .description {
    font-weight: normal;
    letter-spacing: 0.009375em;
    line-height: 1rem;
    font-family: 'Roboto', sans-serif;
    max-height: 48px;
    word-break: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
