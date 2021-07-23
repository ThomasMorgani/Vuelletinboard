<template>
  <v-card flat>
    <v-card-title class="title primary--text">
      <v-row>
        <v-col cols="8">
          <v-card flat height="8rem" max-height="8rem">
            <v-tabs v-model="tabs" height="40">
              <v-tab width="50">
                <v-icon> mdi-information </v-icon>
              </v-tab>
              <v-tab>
                <v-badge :content="filtersCount" :value="filtersCount" color="green" top overlap>
                  <v-icon> mdi-filter </v-icon>
                </v-badge>
              </v-tab>
              <v-tab>
                <v-icon> mdi-key </v-icon>
              </v-tab>
              <v-tabs-items v-model="tabs">
                <v-tab-item key="info"><Info :counts="counts"></Info> </v-tab-item>
                <v-tab-item key="filter"
                  ><Filters :filters="filters" :filtersCount="filtersCount" @filtersClear="onFiltersClear" @filterToggle="onFilterToggle"></Filters>
                </v-tab-item>
                <v-tab-item key="legend">
                  <Legend></Legend>
                </v-tab-item>
              </v-tabs-items>
            </v-tabs>
          </v-card>
        </v-col>
        <v-col>
          <v-card flat height="8rem" max-height="8rem" class="d-flex align-content-space-between flex-wrap">
            <v-btn block color="primary" @click="itemNew"> <v-icon left>mdi-plus </v-icon> ADD NEW </v-btn>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details clearable> </v-text-field>
          </v-card>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :loading="loading"
        :headers="tableHeaders"
        :items="itemsList"
        :search="search"
        hide-default-footer
        :options.sync="tableOptions"
        height="65vh"
        fixed-header
        class="elevation-1 mt-2"
      >
        <template v-slot:body="{ items }">
          <tbody>
            <Row
              v-for="item in items"
              :key="item.id"
              :item="item"
              @itemDelete="onItemDelete"
              @itemEdit="onItemEdit"
              @mediaModalToggle="onMediaModalToggle"
              @visibilityToggle="onVisibilityToggle"
            ></Row>
          </tbody>
        </template>
        <template slot="no-data">
          <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
      </v-data-table>
      <ItemModal
        :key="modalItem.item.id + '' + modalItem.show"
        v-bind="{ ...modalItem, itemDefault }"
        @close="onItemEditClose"
        @itemDelete="itemDelete"
        @itemSave="itemSave"
        @mediaModalToggle="onMediaModalToggle"
      ></ItemModal>
      <MediaModal v-bind="modalMedia" @mediaModalToggle="onMediaModalToggle" @input="modalMedia.show = $event"></MediaModal>
    </v-card-text>
  </v-card>
</template>

<script>
  import items from '@/data/events.json'
  import Info from '@/components/Management/Info'
  import Filters from '@/components/Management/Filters'
  import Legend from '@/components/Management/Legend'
  import ItemModal from '@/components/Management/modalItem'
  import MediaModal from '@/components/Management/modalMedia'
  import Row from '@/components/Management/EventTablerow'
  export default {
    name: 'itemManagement',
    components: { Filters, Info, ItemModal, Legend, MediaModal, Row },
    data: () => ({
      filters: {
        isActive: {
          name: 'isActive',
          label: 'Visible',
          value: false,
        },
        isHidden: {
          name: 'isHidden',
          label: 'Hidden',
          value: false,
        },
        isScheduleActive: {
          name: 'isScheduleActive',
          label: 'Schedule Active',
          value: false,
        },
        isScheduleExpired: {
          name: 'isScheduleExpired',
          label: 'Schedule Expired',
          value: false,
        },
        isSchedulePending: {
          name: 'isSchedulePending',
          label: 'Schedule Pending',
          value: false,
        },
      },
      itemDefault: {
        content_desc: null,
        content_type: null,
        content_scheduled_date: null,
        content_title: null,
        content_media: null,
        content_media_type: null,
        content_date: null,
        created_by: null,
        created_on: null,
        event_date: null,
        event_time: null,
        id: null,
        visible: true,
        scheduleEnd: null,
        scheduleStart: null,
      },
      items: [],
      loading: true,
      modalDelete: {
        show: false,
      },
      modalItem: {
        item: {},
        show: false,
        showDelete: false,
      },
      modalMedia: {
        item: {},
        show: false,
      },
      search: null,
      tableHeaders: [
        {
          text: 'TITLE',
          align: 'start',
          sortable: true,
          value: 'content_title',
        },
        {
          text: 'DESCRIPTION',
          value: 'content_desc',
          align: 'start',
          sortable: true,
        },
        {
          text: 'DATE',
          value: 'content_date',
          align: 'start',
          sortable: true,
        },
        {
          text: 'MEDIA',
          value: 'content_media',
          align: 'center',
          sortable: false,
        },
        {
          text: 'VISIBLE',
          value: 'content_media',
          align: 'center',
          sortable: false,
        },
        {
          text: 'SCHEDULE',
          value: 'scheduleStart',
          align: 'center',
          sortable: false,
        },
        { text: '', value: 'visible', align: 'end', sortable: false },
      ],
      tableOptions: {
        groupBy: [],
        groupDesc: [],
        itemsPerPage: 10000,
        multiSort: false,
        mustSort: false,
        page: 1,
        sortBy: ['content_title'],
        sortDesc: [false],
      },
      tabs: null,
    }),
    computed: {
      counts() {
        const counts = {
          active: 0,
          pastDate: 0,
          scheduledActive: 0,
          scheduledExpired: 0,
          scheduledPending: 0,
        }
        this.itemsList.forEach(item => {
          if (item.isActive) {
            counts.active++
          }
          if (item.isPastitemDate) {
            counts.pastDate++
          }
          if (item.isScheduleActive) {
            counts.scheduledActive++
          }
          if (item.isScheduleExpired) {
            counts.scheduledExpired++
          }
          if (item.isSchedulePending) {
            counts.scheduledPending++
          }
        })
        return counts
      },
      filtersCount() {
        let count = 0
        Object.values(this.filters).forEach(filter => filter.value && count++)
        return count
      },
      itemsList() {
        let list = this.items.map(item => {
          item.isActive = this.isActive(item)
          item.isHidden = !item.isActive
          item.isPastitemDate = this.isPastitemDate(item)
          item.isScheduleActive = this.isScheduleActive(item)
          item.isScheduleExpired = this.isScheduleExpired(item)
          item.isSchedulePending = this.isSchedulePending(item)
          item.scheduleIconData = this.scheduleIcon(item)
          return item
        })
        for (let filter in this.filters) {
          if (this.filters[filter].value) {
            list = [...list].filter(item => item[filter])
          }
        }
        return list
      },
      now() {
        const currentDt = new Date()
        return currentDt
      },
    },
    methods: {
      DatetimeFromTimestamp(timestamp) {
        return new Date(timestamp.substring(' ', 'T'))
      },
      initialize() {
        this.loading = true
        this.$http
          .get('https://eipl.org/bulletinboard/index.php/contentmanager/getAllArticles')
          .then(resp => {
            if (resp?.data?.length > 0) {
              this.items = resp.data.map(item => {
                item = this.itemNormalize(item)
                item.scheduleIconData = this.scheduleIcon(item)
                return item
              })
            }
          })
          .then(() => {
            this.loading = false
          })
          .catchAll(err => console.log('error init:', err))
      },
      initializeOffline() {
        const itemList = items
        this.items = itemList.map(item => {
          item = this.itemNormalize(item)
          item.scheduleIconData = this.scheduleIcon(item)
          return item
        })
        this.loading = false
      },
      isActive(item) {
        return item.visible == true
      },
      isPastitemDate(item) {
        if (item.content_scheduled_date) {
          const itemDate = new Date(item.content_scheduled_date)
          return itemDate < this.now
        } else {
          return false
        }
      },
      isScheduleActive(item) {
        if (item.scheduleEnd && item.scheduleStart) {
          const schedStartDate = new Date(item.scheduleStart)
          const schedEndDate = new Date(item.scheduleEnd)
          return this.now > schedStartDate && this.now < schedEndDate
        } else {
          return false
        }
      },
      isScheduleExpired(item) {
        if (item.scheduleEnd) {
          const schedEndDate = new Date(item.scheduleEnd)
          return schedEndDate < this.now
        } else {
          return false
        }
      },
      isSchedulePending(item) {
        if (item.scheduleStart) {
          const schedStartDate = new Date(item.scheduleStart)
          return this.now < schedStartDate
        } else {
          return false
        }
      },
      itemNormalize(item) {
        //refactoring backend
        //this method will be removed when backend returns
        //new item properties/values
        let ni = { ...item }

        ni.content_date = item.content_scheduled_date
        delete ni.content_scheduled_date

        ni.content_media_type = 'image'

        ni.scheduleEnd = item.visibleScheduleEnd === 'noschedule' ? null : item.visibleScheduleEnd
        ni.user_friendly_scheduleEnd = item.user_friendly_visibleScheduleEnd === 'noschedule' ? null : item.user_friendly_visibleScheduleEnd
        delete ni.visibileScheduleEnd
        delete ni.user_friendly_visibleScheduleEnd

        ni.scheduleStart = item.visibleScheduleStart === 'noschedule' ? null : item.visibleScheduleStart
        ni.user_friendly_scheduleStart = item.user_friendly_visibleScheduleStart === 'noschedule' ? null : item.user_friendly_visibleScheduleStart
        delete ni.visibileScheduleStart
        delete ni.user_friendly_visibleScheduleStart

        ni.visible = item.visible == 1
        // console.log(ni)
        return ni
      },
      itemDelete(id) {
        this.items = this.items.filter(item => item.id !== id)
        this.$store.dispatch('snackbar', { color: 'error', message: 'Item Deleted', value: true })
        this.onItemEditClose()
      },
      itemNew() {
        this.modalItem = { item: { ...this.itemDefault }, show: true }
      },
      itemSave(item) {
        this.$store.dispatch('snackbar', { color: 'success', message: 'Item Saved', value: true })
        this.items = [...this.items.filter(i => i.id !== item.id), { ...item }]
        this.modalItem = { item: { ...this.itemDefault }, show: false }
      },
      onFiltersClear() {
        for (let filter in this.filters) {
          this.filters[filter].value = false
        }
      },
      onFilterToggle(filter) {
        this.filters[filter].value = !this.filters[filter].value
      },
      onItemDelete(item) {
        this.modalItem = { item: { ...this.itemDefault, ...item }, show: true, showDelete: true }
      },
      onItemEdit(item) {
        this.modalItem = { item: { ...this.itemDefault, ...item }, show: true }
      },
      onItemEditClose(item) {
        this.modalItem = { item: this.itemDefault, show: false }
      },
      onMediaModalToggle(content) {
        // console.log(content)
        this.modalMedia = { ...content }
      },
      onVisibilityToggle(item) {
        this.items = [...this.items].map(i => {
          if (i.id === item.id) {
            i.visible = i.visible == 0 ? 1 : 0
            return i
          } else {
            return i
          }
        })
      },
      scheduleIcon(item) {
        if (item?.scheduleStart === 'noschedule' || item?.scheduleStart === 'ERROR' || item?.scheduleEnd === 'noschedule' || item?.scheduleEnd === 'ERROR') {
          return { icon: '', color: '', tooltip: '' }
        } else {
          switch (true) {
            case item.isSchedulePending:
              return {
                icon: 'mdi-alarm',
                color: 'primary',
                tooltip: `<strong>PENDING</strong><br /> ${item.user_friendly_scheduleStart} - ${item.user_friendly_scheduleEnd}`,
              }
            case item.isScheduleActive:
              return {
                icon: 'mdi-alarm-check',
                color: 'success',
                tooltip: `<strong>ACTIVE</strong><br /> ${item.user_friendly_scheduleStart} - ${item.user_friendly_scheduleEnd}`,
              }
            case item.isScheduleExpired:
              return {
                icon: 'mdi-alarm-off',
                color: 'error',
                tooltip: `<strong>EXPIRED</strong><br /> ${item.user_friendly_scheduleStart} - ${item.user_friendly_scheduleEnd}`,
              }
            default:
              return { icon: '', color: '', tooltip: '' }
          }
        }
      },
    },
    created() {
      // this.initialize()
      this.initializeOffline()
    },
  }
</script>

<style lang="scss" scoped>
  .v-tab {
    min-width: unset;
  }
</style>
