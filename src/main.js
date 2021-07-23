import Vue from 'vue'
import vuetify from './plugins/vuetify'
import store from '@/store'
import App from './App.vue'
import router from './router'

import axios from 'axios'
// import axiosConfig from './Configs/axiosConfig'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
new Vue({
  router,
  vuetify,
  store,
  render: h => h(App),
}).$mount('#app')
