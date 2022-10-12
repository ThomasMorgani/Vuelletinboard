<script>
  import formats from '@/utils/formats'
  export default {
    name: 'itemSchedule',
    props: {
      item: {
        type: Object,
        required: false,
      },
    },
    data: () => ({
      modalScheduleDateStart: false,
      modalScheduleDateEnd: false,
      modalScheduleTimeStart: false,
      modalScheduleTimeEnd: false,
      dateStart: null,
      dateEnd: null,
      timeStart: null,
      timeEnd: null,
    }),
    computed: {
      dateEndDetail() {
        if (!this.dateEnd) {
          return 'No event date'
        } else {
          return formats.dateHuman(this.dateEnd)
        }
      },
      dateStartDetail() {
        if (!this.dateStart) {
          return 'No event date'
        } else {
          return formats.dateHuman(this.dateStart)
        }
      },
      endTimestamp() {
        return this.dateEnd && this.timeEnd ? `${this.dateEnd} ${this.timeEnd}` : null
      },
      startTimestamp() {
        return this.dateStart && this.timeStart ? `${this.dateStart} ${this.timeStart}` : null
      },
      error() {
        if (!this.endTimestamp || !this.startTimestamp) {
          return 'All fields required'
        }

        const endDt = new Date(this.endTimestamp)
        const startDt = new Date(this.startTimestamp)
        if (endDt < startDt) {
          return 'End date/time must come after Start'
        }

        return false
      },
      timeEndDetail() {
        if (!this.timeEnd) {
          return 'No event date'
        } else {
          return formats.timeHuman(this.timeEnd)
        }
      },
      timeStartDetail() {
        if (!this.timeStart) {
          return 'No event date'
        } else {
          return formats.timeHuman(this.timeStart)
        }
      },
    },
    methods: {
      setEnd(end) {
        const [date, time] = end.split(' ')
        this.dateEnd = date
        this.timeEnd = time
      },
      setStart(start) {
        const [date, time] = start.split(' ')
        this.dateStart = date
        this.timeStart = time
      },
    },
    mounted(end) {
      if (this.item?.scheduleEnd) {
        this.setEnd(this.item.scheduleEnd)
      }

      if (this?.item.scheduleStart) {
        this.setStart(this.item.scheduleStart)
      }

      if (!this.item?.scheduleEnd && !this.item?.scheduleStart) {
        const nowTs = formats.timestampFromDt()
        this.setStart(nowTs)
      }
    },
  }
</script>

<template>
  <v-card>
    <v-card-title>
      <span>
        <h3 class="primary--text">Edit Visibility Schedule</h3>
      </span>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="6" class="d-flex justify-center">
          <v-dialog ref="modalScheduleDateStart" v-model="modalScheduleDateStart" :return-value.sync="dateStart" persistent width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateStart"
                label="Start date"
                prepend-icon="mdi-calendar"
                :messages="dateStartDetail"
                readonly
                clearable
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="dateStart" scrollable>
              <v-btn text color="primary" @click="modalScheduleDateStart = false">
                Cancel
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="$refs.modalScheduleDateStart.save(dateStart)">
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col cols="6" class="d-flex justify-center">
          <v-dialog ref="modalScheduleTimeStart" v-model="modalScheduleTimeStart" :return-value.sync="timeStart" persistent width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="timeStart"
                label="Start time"
                prepend-icon="mdi-calendar"
                :messages="timeStartDetail"
                readonly
                clearable
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker v-model="timeStart" scrollable>
              <v-btn text color="primary" @click="modalScheduleTimeStart = false">
                Cancel
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="$refs.modalScheduleTimeStart.save(timeStart)">
                OK
              </v-btn>
            </v-time-picker>
          </v-dialog>
        </v-col>
        <v-col cols="6" class="d-flex justify-center">
          <v-dialog ref="modalScheduleDateEnd" v-model="modalScheduleDateEnd" :return-value.sync="dateEnd" persistent width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="dateEnd" label="End date" prepend-icon="mdi-calendar" :messages="dateEndDetail" readonly clearable v-bind="attrs" v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="dateEnd" scrollable>
              <v-btn text color="primary" @click="modalScheduleDateEnd = false">
                Cancel
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="$refs.modalScheduleDateEnd.save(dateEnd)">
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col cols="6" class="d-flex justify-center">
          <v-dialog ref="modalScheduleTimeEnd" v-model="modalScheduleTimeEnd" :return-value.sync="timeEnd" persistent width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="timeEnd" label="End time" prepend-icon="mdi-calendar" :messages="timeEndDetail" readonly clearable v-bind="attrs" v-on="on"></v-text-field>
            </template>
            <v-time-picker v-model="timeEnd" scrollable>
              <v-btn text color="primary" @click="modalScheduleTimeEnd = false">
                Cancel
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="$refs.modalScheduleTimeEnd.save(timeEnd)">
                OK
              </v-btn>
            </v-time-picker>
          </v-dialog>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions class="d-flex align-center">
      <v-spacer></v-spacer>
      <v-btn color="error" text @click.stop="$emit('cancel')">CANCEL</v-btn>

      <v-tooltip top color="error" :disabled="error === false">
        <template v-slot:activator="{ on, attrs }">
          <div v-on="on" v-bind="attrs">
            <v-btn color="primary" text :disabled="error !== false" @click.stop="$emit('updateSchedule', { end: endTimestamp, start: startTimestamp })" class="font-weight-bold"
              >SAVE</v-btn
            >
          </div>
        </template>
        <span class="font-weight-bold">{{ error }}</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
  >>> .v-messages__message {
    line-height: 14px;
  }
</style>
