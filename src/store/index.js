import Vue from 'vue'
import Vuex from 'vuex'

import demoUser from '../data/user_demo.json'
import events from '../data/events.json'
import settingsApp from '../data/settings_app.json'
import settingsBulletinboard from '../data/settings_bulletinboard.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    app: {},
    appLoading: true,
    board: {},
    header: {},
    item: {},
    items: [],
    snackbar: {
      options: {
        app: true,
        centered: true,
        outlined: true,
        text: true,
        timeout: 2500,
        top: true,
      },
      color: '',
      message: '',
      value: false,
    },
    settings: {},
    theme: {},
    user: {},
    roles: ['admin', 'content', 'user'],
    ticker: {},
  },
  getters: {
    isAdmin(state) {
      // return true
      return state?.user?.role?.indexOf('isAdmin') > -1
    },
    isAuth(state) {
      return state.user.id !== undefined
    },
    settingsByCat(state) {
      const settings = {
        app: {},
        board: {},
        header: {},
        item: {},
        theme: {},
        ticker: {},
      }
      Object.keys(state.settings).forEach(setting => {
        const str = setting.substring(0, 3)
        switch (str) {
          case 'app':
            settings.app[setting] = state.settings[setting]
            break
          case 'boa':
            settings.board[setting] = state.settings[setting]
            break
          case 'hea':
            settings.header[setting] = state.settings[setting]
            break
          case 'ite':
            settings.item[setting] = state.settings[setting]
            break
          case 'the':
            settings.theme[setting] = state.settings[setting]
            break
          case 'tic':
            settings.ticker[setting] = state.settings[setting]
            break
          default:
            console.log(str, 'is not found')
            break
        }
      })
      return settings
    },
  },
  actions: {
    checkAuth({ state }) {
      return state.user?.id !== null
    },

    headerSet({ commit }, header) {
      commit('COMMIT_HEADER', header)
    },

    async init({ commit, dispatch }, $vuetify) {
      const data = localStorage.getItem('settings_app') || settingsApp
      if (data.app) {
        commit('COMMIT_APP', data.app)
      }

      const isLoggedIn = localStorage.getItem('isLoggedIn') === 't'
      if (isLoggedIn) {
        data.user = demoUser
      }

      if (data.theme) {
        const darkStored = localStorage.getItem('isDark')
        if (data?.theme) {
          if (darkStored === null) {
            localStorage.setItem('isDark', data.theme.isDark)
          } else {
            data.theme.isDark = darkStored === 'true'
          }
          dispatch('themeSet', { $vuetify, theme: data.theme })
        }
      }

      if (data.user) {
        commit('COMMIT_USER', data.user)
      }
      commit('COMMIT_APPLOADING', false)
    },
    async initBulletinboard({ commit }) {
      const localData = localStorage.getItem('settings_bulletinboard') || false
      const localItems = localStorage.getItem('items') || false
      const data = localData ? JSON.parse(localData) : settingsBulletinboard
      data.items = localItems ? JSON.parse(localItems) : events
      if (data && typeof data === 'object') {
        for (let item in data) {
          const mutation = `COMMIT_${item.toUpperCase()}`
          commit(mutation, data[item])
        }
      }
    },
    itemSet({ commit }, items) {
      commit('COMMIT_ITEM', items)
    },
    itemsSet({ commit }, items) {
      commit('COMMIT_ITEMS', items)
    },
    logout({ commit }) {
      commit('COMMIT_USER', {})
      localStorage.removeItem('isLoggedIn')
    },
    resetDemo() {
      console.log('reset all demo data, window.location.replace()')
    },
    settingsSet({ commit, state }, settingsValues) {
      return new Promise((res, rej) => {
        let settings = {}
        for (let setting in settingsValues) {
          const isObject = typeof settingsValues[setting] === 'object' && settingsValues[setting] !== null
          settings[setting] = isObject ? { ...settingsValues[setting] } : { ...state.settings[setting], value: settingsValues[setting] }
        }
        if (settings.tickerFilter) {
          if (settings.tickerFilter.value && typeof settings.tickerFilter.value === 'string') settings.tickerFilter.value = JSON.parse(settings.tickerFilter.value)
          if (settings.tickerFilter && typeof settings.tickerFilter === 'string') settings.tickerFilter = JSON.parse(settings.tickerFilter)
        }
        commit('COMMIT_SETTINGS', { ...state.settings, ...settings })
        res()
      })
    },
    setUserdata({ commit }, data) {
      commit('COMMIT_USER', data)
    },
    snackbar({ commit, state }, { color, message, value }) {
      // toggleSnackbar(color, message, value) {
      const sb = {
        ...state.snackbar,
        options: {
          ...state.snackbar.options,
          color,
        },
        message,
        value,
      }
      commit('COMMIT_SNACKBAR', sb)
    },
    themeSet({ commit }, { $vuetify, theme }) {
      commit('COMMIT_THEME', theme)
      $vuetify.theme.dark = theme.isDark
      $vuetify.theme.themes.dark = { ...$vuetify.theme.themes.dark, ...theme.dark }
      $vuetify.theme.themes.light = { ...$vuetify.theme.themes.light, ...theme.light }
    },
    tickerSet({ commit }, ticker) {
      commit('COMMIT_TICKER', ticker)
    },
  },
  mutations: {
    COMMIT_APP(state, app) {
      state.app = { ...app }
    },
    COMMIT_APPLOADING(state, isLoading) {
      state.appLoading = isLoading
    },
    COMMIT_BOARD(state, board) {
      state.board = { ...board }
    },
    COMMIT_HEADER(state, header) {
      state.header = { ...header }
    },
    COMMIT_ITEM(state, item) {
      state.item = { ...item }
    },
    COMMIT_ITEMS(state, items) {
      state.items = [...items]
    },
    COMMIT_SETTINGS(state, settings) {
      state.settings = { ...settings }
    },
    COMMIT_SNACKBAR(state, snackbar) {
      state.snackbar = { ...snackbar }
    },
    COMMIT_TICKER(state, ticker) {
      state.ticker = { ...ticker }
    },
    COMMIT_THEME(state, theme) {
      state.theme = { ...theme }
    },
    COMMIT_USER(state, data) {
      state.user = { ...data }
    },
  },
})
