import Vue from 'vue'
import './plugins/vuetify'
import VueGoogleCharts from 'vue-google-charts'

import App from './App.vue'
import store from './store'

const $ = require('jquery')

Vue.config.productionTip = false

Vue.use(VueGoogleCharts)

new Vue({
	store,
  render: h => h(App)
}).$mount('#app')
