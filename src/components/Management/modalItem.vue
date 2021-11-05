<template>
  <v-dialog ref="itemModal" :value="show" max-width="50rem" persistent scrollable transition="dialog-transition">
    <v-card min-height="85vh">
      <v-card-title class="text-title font-weight-bold primary--text">
        ITEM EDIT
      </v-card-title>
      <v-card-text>
        <form action="">
          <v-row align="center" justify="center">
            <v-col cols="12" class="pb-0">
              <v-text-field
                v-model="itemEdit.content_title"
                clearable
                color="primary"
                :error-messages="itemEdit.content_title ? null : 'Required'"
                label="Title"
                required
                type="text"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pt-0">
              <v-text-field v-model="itemEdit.content_subtitle" clearable color="primary" hide-details label="Subtitle" type="text"></v-text-field>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-text-field v-model="itemEdit.content_desc" clearable color="primary" label="Description" type="text"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" class="d-flex justify-center pt-0">
              <v-dialog ref="modalEventdate" v-model="modalEventdate" :return-value.sync="itemEdit.event_date" persistent width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="itemEdit.event_date"
                    label="Event date"
                    prepend-icon="mdi-calendar"
                    :messages="dateDetail"
                    readonly
                    clearable
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="itemEdit.event_date" scrollable>
                  <v-btn text color="primary" @click="modalEventdate = false">
                    Cancel
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="$refs.modalEventdate.save(itemEdit.event_date)">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>
            <v-col cols="12" sm="6" class="d-flex justify-center">
              <v-dialog ref="modalEventtime" v-model="modalEventtime" :return-value.sync="itemEdit.event_time" persistent width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="itemEdit.event_time"
                    clearable
                    label="Event time"
                    prepend-icon="mdi-clock-time-four-outline"
                    :messages="timeDetail"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker v-if="modalEventtime" v-model="itemEdit.event_time" full-width>
                  <v-btn text color="primary" @click="modalEventtime = false">
                    Cancel
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="$refs.modalEventtime.save(itemEdit.event_time)">
                    OK
                  </v-btn>
                </v-time-picker>
              </v-dialog>
            </v-col>
            <v-col cols="6">
              <v-select label="Visibility" :items="optionsVisibility" v-model="itemEdit.visible" color="primary">
                <!-- <template #selection="{item}">
                  <v-icon left :color="item.color">{{ item.icon }}</v-icon>
                  <span class="font-weight-bold font-size-medium">
                    {{ item.text }}
                  </span>
                </template> -->
                <template #prepend>
                  <v-icon left :color="itemEdit.visible ? 'success' : 'error'">{{ itemEdit.visible ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
                </template>
                <template #item="{item}">
                  <v-icon left :color="item.color">{{ item.icon }}</v-icon>
                  <span class="font-weight-bold font-size-medium">
                    {{ item.text }}
                  </span>
                </template>
              </v-select>
            </v-col>

            <v-col cols="6">
              <v-switch :input-value="scheduled" label="Schedule" prepend-icon="mdi-alarm" :messages="scheduled ? scheduleDetail : null" @click="toggleSchedule">
                <template #append>
                  <v-dialog v-if="scheduled" ref="modalEventtime" v-model="modalSchedule" :return-value.sync="itemEdit.event_time" persistent width="700px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" text color="warning">
                        <v-icon left>
                          mdi-pencil
                        </v-icon>
                        edit
                      </v-btn>
                    </template>
                    <ScheduleEdit
                      :item="itemEdit"
                      :key="modalSchedule + ''"
                      :show="modalSchedule"
                      @cancel="modalSchedule = false"
                      @updateSchedule="onUpdateSchedule"
                    ></ScheduleEdit>
                  </v-dialog>
                </template>
              </v-switch>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="12">
              <Media :item="itemEdit" @imageClicked="$emit('mediaModalToggle', { item: $event.item, show: true })" @mediaChange="onMediaChange" @mediaReset="onMediaReset"></Media>
            </v-col>
          </v-row>
        </form>
      </v-card-text>
      <v-card-actions>
        <v-dialog v-model="modalDelete" persistent width="400">
          <template #activator="{attrs, on}">
            <v-btn v-bind="attrs" v-on="on" :disabled="!itemEdit.id" text color="error">
              Delete
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="title primary--text">
              Delete Item
            </v-card-title>
            <v-card-text>
              <p class="text-body-1 font-weight-bold text-left mt-4">Permanently delete item from list?</p>
              <v-checkbox :disabled="checkboxDeleteMediaDisabled" label="Delete media" v-model="checkboxDeleteMedia"></v-checkbox>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="primary" @click="modalDelete = false">
                Cancel
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn text color="error" :loading="btnLoading === 'delete'" @click="itemDelete" class="font-weight-bold">
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="$emit('close')">
          Cancel
        </v-btn>
        <v-tooltip color="error" :disabled="!savebtnMessage" top>
          <template #activator="{ on, attrs }">
            <div v-bind="attrs" v-on="on">
              <v-btn color="success" :disabled="savebtnMessage !== null" text @click="itemSave" class="font-weight-bold">
                Save
              </v-btn>
            </div>
          </template>
          <p>{{ savebtnMessage }}</p>
        </v-tooltip>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import formats from '@/utils/formats'
  import Media from '@/components/Management/ItemMedia'
  import ScheduleEdit from '@/components/Management/modalItemSchedule'

  export default {
    name: 'itemEditModal',
    props: {
      item: {
        type: Object,
        required: true,
      },
      itemDefault: {
        type: Object,
        required: true,
      },
      show: {
        type: Boolean,
        default: () => false,
      },
      showDelete: {
        type: Boolean,
        default: () => false,
      },
    },
    components: {
      Media,
      ScheduleEdit,
    },
    data: () => ({
      btnLoading: null,
      checkboxDeleteMedia: true,
      itemEdit: null,
      mediaFile: null,
      optionsVisibility: [
        {
          text: 'HIDDEN',
          value: false,
          icon: 'mdi-eye-off',
          color: 'error',
        },
        {
          text: 'VISIBLE',
          value: true,
          icon: 'mdi-eye',
          color: 'success',
        },
      ],
      modalDelete: false,
      modalEventdate: false,
      modalEventtime: false,
      modalSchedule: false,
      scheduled: false,
      scheduledFirst: true,
    }),
    computed: {
      checkboxDeleteMediaDisabled() {
        return this.itemEdit?.content_media_type !== 'image'
      },
      dateDetail() {
        if (!this.itemEdit.event_date) {
          return 'No event date'
        } else {
          return formats.dateHuman(this.itemEdit.event_date)
        }
      },
      savebtnMessage() {
        //test changes
        //test required
        const required = ['title', 'content_media']
        let message = null
        required.forEach(req => {
          if (this.itemEdit[req] === null) {
            message = 'Please check required fields'
          }
        })
        return message
      },
      scheduleDetail() {
        if (!this.itemEdit.user_friendly_scheduleEnd && !this.itemEdit.user_friendly_scheduleStart) {
          return 'Schedule not set'
        } else {
          return `${this.itemEdit.user_friendly_scheduleStart} - ${this.itemEdit.user_friendly_scheduleEnd}`
        }
      },
      timeDetail() {
        if (!this.itemEdit.event_time) {
          return 'No event time'
        } else {
          return formats.timeHuman(this.itemEdit.event_time)
        }
      },
    },
    methods: {
      test1(e) {
        console.log(e)
        // $emit('mediaModalToggle', { item, show: true })
      },
      itemDelete() {
        console.log('delete item')
        this.btnLoading = 'delete'
        this.$emit('itemDelete', this.item.id)
        this.$emit('close')
        this.$store.dispatch('snackbar', { color: 'success', message: 'Item deleted!', value: true })
      },
      itemSave() {
        this.setContentDate()
        this.$store.dispatch('snackbar', { color: 'success', message: 'Item saved!', value: true })
        this.$emit('itemSave', this.itemEdit)
      },
      onMediaChange({ item, file }) {
        console.log(item, file)
        this.mediaFile = file
        this.itemEdit = { ...this.itemEdit, ...item }
      },
      onMediaReset() {
        const { content_media, content_media_type } = this.item
        this.mediaFile = null
        this.itemEdit = { ...this.itemEdit, content_media, content_media_type }
      },
      onUpdateSchedule({ end, start }) {
        const [endDate, endTime] = end.split(' ')
        const [startDate, startTime] = start.split(' ')
        this.itemEdit.scheduleEnd = end
        this.itemEdit.user_friendly_scheduleEnd = `${formats.dateHuman(endDate, true, false)} ${formats.timeHuman(endTime)} `
        this.itemEdit.scheduleStart = start
        this.itemEdit.user_friendly_scheduleStart = `${formats.dateHuman(startDate, true, false)} ${formats.timeHuman(startTime)} `
        this.modalSchedule = false
      },
      setContentDate() {
        let contentdate = ''
        if (this.itemEdit.event_date) contentdate += this.itemEdit.event_date
        if (this.itemEdit.event_time) contentdate += contentdate === null ? this.itemEdit.event_time : ` ${this.itemEdit.event_time}`
        this.itemEdit.content_date = contentdate || null
        return this.itemEdit.content_date
      },
      setEventDatetime(dt) {
        const [date, time] = dt.split(' ')
        this.itemEdit.event_date = date === '0000-00-00' ? null : date
        this.itemEdit.event_time = time === '00:00:00' ? null : time
      },
      toggleSchedule() {
        if (this.scheduledFirst) {
          this.modalSchedule = true
          this.scheduledFirst = false
        }
        this.scheduled = !this.scheduled
      },
    },
    created() {
      const states = ['isScheduleActive', 'isScheduleExpired', 'isSchedulePending']
      let isScheduled = false
      this.itemEdit = { ...this.item } || { ...this.itemDefault }

      if (this.itemEdit.content_date) {
        this.setEventDatetime(this.itemEdit.content_date)
      }

      states.forEach(state => {
        if (this.itemEdit[state]) {
          isScheduled = true
        }
      })
      if (isScheduled) {
        this.scheduled = true
        this.scheduledFirst = false
      }

      if (this.checkboxDeleteMediaDisabled) {
        this.checkboxDeleteMedia = false
      }

      setTimeout(() => (this.modalDelete = this.showDelete), 500)
    },
  }
</script>

<style lang="scss" scoped></style>
