<template>
  <v-card flat color="transparent">
    <v-card-title class="subheading primary--text pt-1 pb-2 pl-0 ">
      FILTERS
      <v-btn small text color="error" :disabled="filtersCount < 1" @click="$emit('filtersClear')" class="ml-2">
        <v-icon left color="error">mdi-filter-off</v-icon> clear all</v-btn
      ></v-card-title
    >
    <v-card-text>
      <v-layout row wrap>
        <v-col cols="4" lg="3" v-for="filter in filters" :key="filter.name" class="pa-0">
          <v-checkbox :input-value="filter.value" dense hide-details @click="$emit('filterToggle', filter.name)" class="mt-1 checkbox">
            <template v-slot:label>
              {{ filter.label }}
            </template>
          </v-checkbox>
        </v-col>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'itemFilters',
    props: {
      filters: {
        type: Object,
        required: true,
      },
      filtersCount: {
        type: Number,
        required: true,
      },
    },
  }
</script>

<style lang="scss" scoped>
  .checkbox {
    word-break: break-word;
  }
</style>
