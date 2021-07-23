<template>
  <v-card flat>
    <v-card-title class="subheading primary--text pt-1 pb-2 pl-0 ">
      LEGEND
    </v-card-title>
    <!-- <v-card :height="100"> -->
    <v-card-text>
      <v-layout row wrap>
        <v-col cols="4" v-for="item in legendItems" :key="item.legend" class="pa-0">
          <v-sheet flat class="d-flex caption pa-1">
            <v-icon small :color="item.iconColor" left>{{ item.icon }}</v-icon>
            <p class="mb-0">{{ item.description }}</p>
          </v-sheet>
        </v-col>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'ArticleLegend',
    data: () => ({
      legendItems: [
        {
          legend: 'visibility',
          description: 'Article is being shown',
          icon: 'mdi-eye',
          iconColor: 'success',
        },
        {
          legend: 'visibility_off',
          description: 'Article is hidden from display',
          icon: 'mdi-eye-off',
          iconColor: 'error',
        },
        {
          legend: 'alarm',
          description: 'Scheduled visibility pending',
          icon: 'mdi-alarm',
          iconColor: 'primary',
        },
        {
          legend: 'alarm_on',
          description: 'Scheduled visibility active',
          icon: 'mdi-alarm-check',
          iconColor: 'green',
        },
        {
          legend: 'alarm_off',
          description: 'Scheduled visibility over',
          icon: 'mdi-alarm-off',
          iconColor: 'error',
        },
        {
          legend: 'photo',
          description: 'Media Type',
          icon: 'mdi-image',
          iconColor: 'blue',
        },
        {
          legend: 'edit',
          description: 'Edit Article',
          icon: 'mdi-pencil',
          iconColor: 'teal',
        },
        {
          legend: 'delete',
          description: 'Delete Article (permanent)',
          icon: 'mdi-delete',
          iconColor: 'error',
        },
      ],
    }),
  }
</script>

<style lang="scss" scoped></style>
