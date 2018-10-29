const $ = require('jquery')

const state = {
	results: null
}

const getters = {
	results(state) {
		return state.results
	}
}

const mutations = {
	results(state, result) {
		state.results = result
	}
}

const actions = {
	fetchResults({
		commit
	}, payload){
		commit('loading', true)
		return new Promise(resolve => {
			// 14806
			$.ajax({
	      method: 'GET',
	      url: `https://database.fig-gymnastics.com/public/results/display/${payload.id}?backUrl=&idAgeCategory=${payload.discipline}&idCategory=${payload.category}`,
	    }).then(response => {
	      /* The results */
	      let list = $(response).find('tr').get().map(row => {
	          if($(row).find('th').get().length > 0)
	            return $(row).find('th').get().map(header => $(header).html().replace(/<br>/g, ' '))
	          else
	            return $(row).find('td').get().map(cell => $(cell).html())
	        })
	      /* Get headers */
	      const headers = list.shift()
	      /* Clean data */
	      let json = list.map(gymnast => {

	        let reduced = gymnast.reduce((obj, column, index) => {
	          obj[headers[index]] = $(column).filter('a').html() || column.replace(/\s/g, '')
	          return obj
	        }, {})
	        return reduced
	      })
				commit('loading', false)
	      commit('results', json)
	      resolve()
	    })
   	})
	}
}

export default { state, getters, mutations, actions }
