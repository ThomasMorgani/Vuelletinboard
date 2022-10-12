<template>
  <v-card tile width="100%">
    <v-card-text>
      <General ref="settings" width="100%" class="my-2"></General>
      <Header width="100%" class="my-4"></Header>
      <Item class="my-4"></Item>
      <Ticker class="my-4"></Ticker>
    </v-card-text>
  </v-card>
</template>

<script>
  import General from '@/components/Settings/Content/General'
  import Header from '@/components/Settings/Content/Header'
  import Item from '@/components/Settings/Content/Item'
  import Ticker from '@/components/Settings/Content/Ticker'
  export default {
    name: 'ContentSettings',
    components: { General, Header, Item, Ticker },
  }
</script>
