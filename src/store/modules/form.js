// http://www.fig-gymnastics.com/api/sportevents?from=2018-10-28&to=2019-04-28&level=&discipline=&ageGroupType=&country=&title=&id=
// http://www.fig-gymnastics.com/api/sportevents?from=2018-10-28&to=2019-04-28&level=6&discipline=5&ageGroupType=2&country=&title=&id=

const $ = require('jquery')

/* We have defaulted discipline to trampoline and level to world championships, age group to senior */
const baseUrl = 'http://www.fig-gymnastics.com/api/sportevents?level=6&discipline=5&ageGroupType=2'

const state = {
	competitions: []
}

const getters = {
	competitions(state) {
		return state.competitions
	}
}

const mutations = {
	competitions(state, competitions) {
		state.competitions = competitions
	}
}

const actions = {
	fetchResultForms({
		commit
	}, payload) {
		const url = baseUrl + `&from=${payload.from}&to=${payload.to}`
		$.ajax({
			method: 'GET',
			url: url
		}).then(response => {
			/* In the response we are interested in the events ID and title for diplaying, also hasResults since it has to be true*/
			const comps = response.data.map(comp => {
				return {id: comp.id, title: comp.title, hasresults: comp.hasresults}
			})
			commit('competitions', comps)
		})
	}
}

export default {
	state, getters, mutations, actions
}