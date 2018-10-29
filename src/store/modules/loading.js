const state = {
	loading: false
}

const mutations = {
	loading(state, loading) {
		state.loading = loading
	}
}

const getters = {
	loading(state) {
		return state.loading
	}
}

export default {
	state, mutations, getters
}