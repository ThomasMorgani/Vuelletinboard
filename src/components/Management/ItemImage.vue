<template>
  <v-img :src="src + ''" contain @click="$emit('imageClicked', { item })"></v-img>
</template>

<script>
  export default {
    name: 'itemImage',
    props: {
      item: {
        type: Object,
        required: true,
      },
      options: {
        type: Object,
        default: () => ({}),
      },
    },
    computed: {
      imageProps() {
        return
      },
      src() {
        const isUrl = this.item?.content_media?.includes('/')
        //url
        const mediaType = this.item.content_media_type
        if (mediaType === 'image_url') {
          return this.item.content_media
        }

        //blob
        if (this.item.content_media.includes('blob:')) {
          return this.item.content_media
        } else {
          //upload
          return `${process.env.VUE_APP_MEDIA_URL}/events/${this.item.content_media}`
        }
      },
    },
    methods: {},
  }
</script>

<style lang="scss" scoped></style>
