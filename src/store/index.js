import Vue from 'vue'
import Vuex from 'vuex'

import demoUser from '../data/user_demo.json'
import events from '../data/events.json'
import settingsAdmin from '../data/settings_admin.json'
import settingsApp from '../data/settings_app.json'
import settingsBulletinboard from '../data/settings_bulletinboard.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    app: {},
    appLoading: true,
    boardSettings: {
      board: {},
      header: {},
      item: {},
      ticker: {},
    },
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
        //TODO: map these to object
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
    appSettingSet({ commit, state }, data) {
      const currSettings = { ...state.app, ...data }
      localStorage.setItem('settings_app', JSON.stringify(currSettings))
      commit('COMMIT_APP', currSettings)
    },
    boardSettingSet({ commit, state }, data) {
      commit('COMMIT_BOARD', { ...state.boardSettings, ...data })
    },
    boardSettingsSave({ state }) {
      localStorage.setItem('settings_bulletinboard', JSON.stringify(state.boardSettings))
    },
    checkAuth({ state }) {
      return state.user?.id !== null
    },

    headerSet({ commit }, header) {
      commit('COMMIT_HEADER', header)
    },
    async init({ commit, dispatch }, $vuetify) {
      const data = {}
      const localAppSettings = localStorage.getItem('settings_app') || false
      const localThemeSettings = localStorage.getItem('settings_theme') || false
      data.app = localAppSettings ? JSON.parse(localAppSettings) : settingsApp.app
      data.theme = localThemeSettings ? JSON.parse(localThemeSettings) : settingsApp.theme
      //do same for theme
      if (data.app) {
        commit('COMMIT_APP', data.app)
      }
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 't'
      if (isLoggedIn) {
        dispatch('loginDemoUser')
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
      commit('COMMIT_APPLOADING', false)
    },
    initAdminSettings({ dispatch }) {
      dispatch('initBulletinboard')
      const localSettings = localStorage.getItem('settings_admin')
      return new Promise(async (resolve, reject) => {
        const settings = localSettings ? JSON.parse(localSettings) : settingsAdmin
        if (settings) {
          await dispatch('settingsSet', settings)

          resolve()
        }
        reject('Error getting settings')
      })
    },
    async initBulletinboard({ commit, dispatch }) {
      return new Promise((res, rej) => {
        const localData = localStorage.getItem('settings_bulletinboard') || false
        const localItems = localStorage.getItem('items') || false
        const boardSettings = localData ? JSON.parse(localData) : settingsBulletinboard
        const items = localItems ? JSON.parse(localItems) : events.items
        dispatch('boardSettingSet', boardSettings)
        dispatch('itemsSet', items)
        res(true)
      })
    },
    itemSet({ commit }, item) {
      commit('COMMIT_ITEM', item)
    },
    itemsSet({ commit }, items) {
      commit('COMMIT_ITEMS', items)
    },
    loginDemoUser({ commit }) {
      localStorage.setItem('isLoggedIn', 't')
      commit('COMMIT_USER', demoUser)
    },
    logout({ commit }) {
      commit('COMMIT_USER', {})
      localStorage.removeItem('isLoggedIn')
    },
    resetDemo() {
      localStorage.clear()
      window.location.replace('/login')
    },
    settingsSet({ commit, state }, settingsValues) {
      //ADMIN SETTINGS
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
        localStorage.setItem('settings_admin', JSON.stringify({ ...state.settings, ...settings }))
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
      localStorage.setItem('settings_theme', JSON.stringify({ isDark: $vuetify.theme.dark, dark: $vuetify.theme.themes.dark, light: $vuetify.theme.themes.light }))
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
      state.boardSettings = { ...board }
    },
    COMMIT_HEADER(state, header) {
      state.boardSettings.header = { ...header }
    },
    COMMIT_ITEM(state, item) {
      state.boardSettings.item = { ...item }
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
      state.boardSettings.ticker = { ...ticker }
    },
    COMMIT_THEME(state, theme) {
      state.theme = { ...theme }
    },
    COMMIT_USER(state, data) {
      state.user = { ...data }
    },
  },
})
