import Vuex from 'vuex'
import Vue from 'vue'

import results from './modules/results.js'
import form from './modules/form.js'
import loading from './modules/loading.js'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
	modules: {
		results, form, loading
	},
	strict: debug
})

export default store
