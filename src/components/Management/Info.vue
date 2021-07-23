<template>
  <v-card flat>
    <v-card-title class="subheading primary--text pt-1 pb-2 pl-0 ">
      DETAILS
    </v-card-title>
    <!-- <v-card :height="100"> -->
    <v-card-text class="d-flex  flex-wrap align-start justify-start">
          <v-sheet  v-for="item in countsDisplayed" :key="item.item" class="d-flex align-center justify-start pa-1 mr-4"
            ><v-icon small :color="item.color" left> {{ item.icon }}</v-icon> {{ `${item.count} ${item.text}` }}</v-sheet
          >
        </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'Info',
    props: {
      counts: {
        pastDate: {
          type: Number,
          required: true,
        },
        scheduledActive: {
          type: Number,
          required: true,
        },
        scheduledExpired: {
          type: Number,
          required: true,
        },
        scheduledExpired: {
          type: Number,
          required: true,
        },
        active: {
          type: Number,
          required: true,
        },
      },
    },
    data: () => ({
      items: {
        active: {
          color: 'success',
          icon: 'mdi-eye',
          text: 'Visible ',
        },
        pastDate: {
          color: 'error',
          icon: 'mdi-timer-sand',
          text: 'Visible post event date',
        },
        scheduledActive: {
          color: 'success',
          icon: 'mdi-alarm-check',
          text: 'Scheduled active',
        },
        scheduledExpired: {
          color: 'error',
          icon: 'mdi-alarm-off',
          text: 'Scheduled expired',
        },
        scheduledPending: {
          color: 'primary',
          icon: 'mdi-alarm',
          text: 'Scheduled pending',
        },
      },
    }),
    computed: {
      countsDisplayed() {
        let counts = {}
        for (let item in this.counts) {
          if (this.counts[item] > 0) {
            counts[item] = { ...this.items[item], count: this.counts[item], item }
          }
        }
        return counts
      },
    },
  }
</script>

<style lang="scss" scoped></style>
