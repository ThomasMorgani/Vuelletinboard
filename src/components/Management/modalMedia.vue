<template>
  <v-dialog :key="item.id + ''" :value="show" max-width="70vw" transition="dialog-transition" @input="$emit('input', $event)" @click.stop>
    <ItemImage :item="item" max-width="100%" contain @imageClicked="$emit('mediaModalToggle', { item, show: false })"></ItemImage>
  </v-dialog>
</template>

<script>
  import ItemImage from '@/components/Management/ItemImage'
  export default {
    name: 'MediaModal',
    props: {
      item: {
        type: Object,
        required: true,
      },
      show: {
        type: Boolean,
        default: () => false,
      },
    },
    components: {
      ItemImage,
    },
  }
</script>

<style lang="scss" scoped></style>
