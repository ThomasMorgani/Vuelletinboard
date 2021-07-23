import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
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
      return state?.user?.roles?.indexOf('admin') > -1
    },
    isAuth(state) {
      return state?.user?.roles?.indexOf('user') > -1
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
    async apiGet({ commit, state }, endpoint) {
      let response = {}
      try {
        response = await axios.get(`${process.env.VUE_APP_API_URL}${endpoint}`)
      } catch (err) {
        response = err.response
        console.log(err)
      }
      if (response?.status === 401) {
        if (router?.currentRoute?.name !== 'Login') router.push({ name: 'Login', params: response })
      }
      return response.data
    },
    async apiPost({ commit, state }, { endpoint, postData }) {
      let response = {}
      try {
        response = await axios({
          method: 'POST',
          url: `${process.env.VUE_APP_API_URL}${endpoint}`,
          headers: { 'content-type': 'multipart/form-data' },
          data: postData,
        })
      } catch (err) {
        response = err.response
      }
      if (response?.status === 401) {
        if (router?.currentRoute?.name !== 'Login') router.push({ name: 'Login', params: response })
      }
      return response.data
    },
    headerSet({ commit }, header) {
      commit('COMMIT_HEADER', header)
    },
    async init({ commit, dispatch, state }, $vuetify) {
      const data = await dispatch('apiGet', '')
      if (data.app) {
        commit('COMMIT_APP', data.app)
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
    async initBulletinboard({ dispatch, commit }) {
      const endpoint = 'bulletinboard'
      const data = await dispatch('apiGet', endpoint)
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
  },
})
