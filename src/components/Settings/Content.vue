<template>
  <v-card tile width="100%">
    <v-card-text>
      <Background ref="settings" width="100%" class="my-1"></Background>
      <Header width="100%" class="my-1"></Header>
      <Item class="my-1"></Item>
      <Ticker class="my-1"></Ticker>
    </v-card-text>
  </v-card>
</template>

<script>
  import Background from '@/components/Settings/Content/Background'
  import Header from '@/components/Settings/Content/Header'
  import Item from '@/components/Settings/Content/Item'
  import Ticker from '@/components/Settings/Content/Ticker'
  export default {
    name: 'ContentSettings',
    components: { Background, Header, Item, Ticker },
    methods: {},
    mounted() {},
  }
</script>

<style lang="scss" scoped></style>
