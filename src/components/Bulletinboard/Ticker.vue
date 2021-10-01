<template>
  <v-app-bar app bottom :color="settings.tickerColor" :height="settings.tickerHeight" ref="ticker" class="d-flex align-center" :style="{ color: settings.tickerTextColor }">
    <div class="d-flex flex-column  text-no-wrap ">
      <p class="text-subtitle-1 ma-0 mt-2">{{ date }}</p>
      <p class="text-h6 ma-0 mb-2">{{ time }}</p>
    </div>
    <v-divider vertical dark class="px-2"></v-divider>
    <v-icon class="flex-shrink-1 px-4" :color="settings.tickerTextColor">mdi mdi-newspaper</v-icon>

    <div class="newsFeedDiv">
      <!-- <font class="text-white headline pr-1">HEADLINES:</font> -->
      <span class="marquee">
        <p class="marquee-text mb-0" :class="marqueeSpeed()" v-html="newsfeed"></p>
      </span>
    </div>
    <div id="weatherDiv" v-if="this.weatherData != ''">
      <p class="text-xs-center weathertempPtag">
        <font class="weatherTemp">{{ this.weatherData.item.condition.temp }}&#176;</font>
      </p>
      <img class="weatherIcon" v-bind:src="this.weatherIcon" />
    </div>
  </v-app-bar>
</template>

<script>
  import { mapState } from 'vuex'
  import RSSParser from 'rss-parser'
  export default {
    data: () => ({
      name: 'ticker',
      newsfeed: '',
      newsfeedCount: 0,
      newsfeedLoading: true,
      date: 'DATE',
      time: 'TIME',
      timeInterval: null,
      weatherData: '',
      weatherIcon: '',
    }),
    computed: {
      ...mapState({
        settings: state => state.ticker,
      }),
    },
    methods: {
      async feedFetch(rss) {
        const corsproxy = process.env.VUE_APP_CORS_PROXY
        // debug
        // this.newsfeed = `Herman Cain, former GOP presidential candidate, dies from coronavirus at 74 •  Judge blocks Trump admin's rule barring immigrants who use public benefits •  Army ready to begin broad review at Fort Hood in wake of Guillen murder •  'We will not be leaving' Portland until 'safety' is restored: Trump •  Few medical reasons for not wearing a face mask •  Police: Florida couple jailed for refusing to quarantine •  Another cache of documents related to Ghislaine Maxwell expected to be released •  Trump nominee hearing pulled after furor over Islam remarks •  UK scientists to immunize hundreds with coronavirus vaccine •  Wisconsin governor orders masks statewide amid virus surge •  Russia sentences 2nd ex-US Marine to long jail sentence •  UK rapper Solo 45 sentenced to 24 years for violent rapes •  Trump stokes racist fears after revoking Obama-era housing rule • LIVE:  ABC News Live •  Prosecutor not charging Ferguson officer who killed Michael Brown •  Herman Cain, former GOP presidential candidate, dies from coronavirus at 74 •  Judge blocks Trump admin's rule barring immigrants who use public benefits •  Army ready to begin broad review at Fort Hood in wake of Guillen murder •  'We will not be leaving' Portland until 'safety' is restored: Trump •  Few medical reasons for not wearing a face mask •  Police: Florida couple jailed for refusing to quarantine •  Another cache of documents related to Ghislaine Maxwell expected to be released •  Trump nominee hearing pulled after furor over Islam remarks •  UK scientists to immunize hundreds with coronavirus vaccine •  Wisconsin governor orders masks statewide amid virus surge`
        // return
        // const rss = 'https://abcnews.go.com/abcnews/topstories'
        const parser = new RSSParser()
        let feed = null
        try {
          return await parser.parseURL(corsproxy + rss)
        } catch (err) {
          console.log('get feed error', err)
        }
      },
      feedParse(items = []) {
        let feedStr = ''
        const defaultText = 'Welcome to Vulletinboard!'
        if (!items || items.length < 1) {
          feedStr = defaultText
        } else {
          items.forEach(item => {
            let filterMatch = false
            if (item.title) {
              this.settings.tickerFilter.forEach(filter => {
                if (item.title.toLowerCase().includes(filter.toLowerCase())) filterMatch = true
              })
            }
            if (!filterMatch) feedStr += feedStr === '' ? item.title : ' • ' + item.title
          })
        }
        //fill ticker space
        //todo: calc width, determine padding by vw
        if (feedStr.length < 800) {
          let count = 1
          while (count < 5) {
            feedStr += ' • ' + feedStr
            count++
          }
        }
        return feedStr
      },
      marqueeSpeed() {
        const speeds = {
          1: 'one',
          2: 'two',
          3: 'three',
          4: 'four',
          5: 'five',
          6: 'six',
        }
        return speeds[this.settings.tickerSpeed] || 'three'
      },
      timeUpdate() {
        const now = new Date()
        let h = now.getHours()
        let m = now.getMinutes()
        let s = now.getSeconds()
        let M = now.getMonth() + 1
        let D = now.getDate()
        let Y = now.getFullYear()
        let period = 'AM'
        if (h > 12) {
          h = h - 12
          period = 'PM'
        } else {
          period = h === 12 ? 'PM' : 'AM'
        }
        if (h == 0) h = 12
        this.date = `${M.toString().padStart(2, '0')}/${D.toString().padStart(2, '0')}/${Y}`
        this.time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} ${period}`
      },
    },
    async created() {
      let items = []

      if (this?.settings?.tickerRss === 'custom') {
        items = this.settings.tickerFeed
      } else {
        items = await this.feedFetch(this.settings.tickerRss)
        items = items.items
      }
      this.newsfeed = this.feedParse(items)
      this.timeInterval = setInterval(this.timeUpdate, 1000)
    },
    beforeDestroy() {
      clearInterval(this.timeInterval)
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep .v-toolbar__content {
    width: 100%;
  }
  p {
    margin-bottom: 0em;
  }
  .newsFeedDiv {
    white-space: nowrap;
    overflow-x: hidden;
    overflow-y: hidden;
    max-height: 100%;
    /*max-width: 680px;*/
  }

  .marquee {
    height: 100%;
    width: 100%;
    /*background-color: Pink;*/

    white-space: nowrap;
    overflow: hidden;
    box-sizing: border-box;
  }
  .marquee p {
    display: inline-block;
    // padding-left: 100%;
  }
  .marquee p.one {
    display: inline-block;
    animation: marquee 1000s linear infinite;
    // padding-left: 100%;
  }
  .marquee p.two {
    display: inline-block;
    animation: marquee 500s linear infinite;
    // padding-left: 100%;
  }
  .marquee p.three {
    display: inline-block;
    animation: marquee 300s linear infinite;
    // padding-left: 100%;
  }
  .marquee p.four {
    display: inline-block;
    animation: marquee 200s linear infinite;
    // padding-left: 100%;
  }
  .marquee p.five {
    display: inline-block;
    animation: marquee 150s linear infinite;
    // padding-left: 100%;
  }
  .marquee p.six {
    display: inline-block;
    animation: marquee 90s linear infinite;
    // padding-left: 100%;
  }
  .marquee-text {
    // color: white;
    font-size: 2em;
  }

  @keyframes marquee {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(-100%, 0);
    }
  }
</style>
