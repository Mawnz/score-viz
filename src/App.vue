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
        <v-flex height="100%" xs6>
          <v-card class="wrapper">
            <LineChart 
              :chartData="chartData"
              xAxisText="Gymnast" 
              yAxisText="Score"
            />
            <v-btn class="clear" @click="chartData = []">Clear</v-btn>
          </v-card>
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
import LineChart from '@/d3-charts/line-chart'

export default {
  name: 'App',
  components: {
    Form,
    Results,
    Loading,
    LineChart
  },
  computed: {
    ...mapGetters([
        'results'
      ])
  },
  watch: {
    results() {
      let d = [...this.results.map((row, i) => ({x: i, y: (parseFloat(row['Score Qualif.']) || 0)}))]

      d.sort((a, b) =>{
        const A = parseFloat(a)
        const B = parseFloat(b)
        if(A > B) return 1
        if(A < B) return -1
        return 0
      }).reverse()
      
      this.id ++

      this.chartData.push({
        id: this.id,
        values: d
      })
    }
  },
  data () {
    return {
      chartData: [],
      id: 1
    }
  }
}
</script>

<style scoped lang="scss">
.form {
  height: 300px;
  margin-bottom: 50px;
}
.fill {
  height: 100%;
}
.wrapper {
  height: 300px;
  position: relative;
  .clear {
    position: absolute;
    bottom: -50px;
    left: 0;
  }  
}


</style>