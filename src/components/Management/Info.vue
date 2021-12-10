<template>
  <v-card flat>
    <v-card-title class="justify-space-between pt-1 pb-2 pl-0 ">
      <div class="primary--text">DETAILS</div>
    </v-card-title>
    <v-card-text class="d-flex  flex-wrap align-start justify-start">
      <v-sheet v-for="item in countsDisplayed" :key="item.item" class="d-flex align-center justify-start pa-1 mr-4"
        ><v-icon small :color="item.color" left> {{ item.icon }}</v-icon> {{ `${item.count} ${item.text}` }}</v-sheet
      >
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'Info',
    props: {
      counts: {
        active: {
          type: Number,
          required: true,
        },
        hidden: {
          type: Number,
          required: true,
        },
        pastDate: {
          type: Number,
          required: true,
        },
        pastDateActive: {
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
        scheduledPending: {
          type: Number,
          required: true,
        },
        totalItems: {
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
        hidden: {
          color: 'error',
          icon: 'mdi-eye-off',
          text: 'Hidden ',
        },

        pastDate: {
          color: 'error',
          icon: 'mdi-timer-sand',
          text: 'Visible events ended',
        },
        pastDateActive: {
          color: 'error',
          icon: 'mdi-timer-sand',
          text: 'Visible events ended',
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
          if (item !== 'totalItems' && this.counts[item] > 0) {
            counts[item] = { ...this.items[item], count: this.counts[item], item }
          }
        }
        return counts
      },
    },
  }
</script>

<style lang="scss" scoped></style>
