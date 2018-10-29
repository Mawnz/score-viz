<template>
  <v-app>
    <Loading/>
    <v-toolbar app>
    </v-toolbar>

    <v-content>
      <v-layout row wrap>
        <v-flex xs6>
          <Form />
        </v-flex>
        <v-flex xs6>
          <GChart 
            type="LineChart"
            :data="chartData"
            :options="options"
          ></GChart>
        </v-flex>
        <v-flex xs12 class="results">
          <Results />
        </v-flex>
      </v-layout>
    </v-content>
  </v-app>
</template>

<script>
import Form from './components/Form'
import Results from './components/Results'
import Loading from './components/Loading'

import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    Form,
    Results,
    Loading
  },
  computed: {
    ...mapGetters([
        'results'
      ])
  },
  watch: {
    results() {
      this.chartData = [Object.keys(this.results[0]), ...this.results.map(row => Object.values(row))]
      console.log(this.chartData)
    }
  },
  data () {
    return {
      chartData: [],
      options: {
        chart: {
          title: 'Stats'
        },
        width: 400,
        height: 300
      }
    }
  }
}
</script>

<style scoped lang="scss">
.form {
  height: 30vh;
  margin-bottom: 50px;
}
.fill {
  height: 100%;
}

</style>