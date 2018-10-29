<template>
  <v-card>
    <v-card-title primary-title>
      <span class="headline">Search for results</span>
    </v-card-title>
    <v-form>
      <v-layout row wrap>
        <v-flex xs8 offset-xs1>
          <v-select
            v-model="id"
            :items="competitionsReversed"
            item-text="title"
            item-value="id"
            label="Competitions"
            dense
          >
          </v-select>
        </v-flex>
        <v-flex xs4 offset-xs1>
          <v-select
            v-model="discipline"
            :items="disciplines"
            item-text="name"
            item-value="value"
            label="Discipline"
            dense
          ></v-select>
        </v-flex>
        <v-flex xs4 offset-xs1>
          <v-select
            v-model="category"
            :items="getCategory"
            item-text="name"
            item-value="value"
            label="Category"
            dense
          ></v-select>
        </v-flex>
      </v-layout>
    </v-form>
    <v-card-actions>
      <v-btn @click="getData" flat>Submit</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'Form',
  data() {
    return {
      json: {},
      id: 14806,
      discipline: 10,
      category: 81,
      disciplines: [
        {name: 'Trampoline Senior', value: 10},
        {name: 'Tumbling Senior', value: 16},
        {name: 'Double-Mini Senior', value: 22}
      ],
      categories: {
        10: [
          {name: 'Men Individual', value: 81},
          {name: 'Women Individual', value: 82},
          {name: 'Men Synchro', value: 83},
          {name: 'Women Synchro', value: 84},
          {name: 'Men Team Trampoline', value: 85},
          {name: 'Women Team Trampoline', value: 86}
        ],
        16: [
          {name: 'Men Tumbling', value: 87},
          {name: 'Women Tumbling', value: 88}, 
          {name: 'Men Team Tumbling', value: 89},
          {name: 'Women Team Tumbling', value: 90}
        ],
        22: [
          {name: 'Men Double-Mini', value: 91}, 
          {name: 'Women Double-Mini', value: 92},
          {name: 'Men Team Double-Mini', value: 93},
          {name: 'Women Team Double-Mini', value: 94}
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'competitions'
    ]),
    getCategory() {
      return this.categories[this.discipline]
    },
    competitionsReversed() {
      return this.competitions.slice().reverse()
    }
  },
  methods: {
    getData() {
      const payload = {
        discipline: this.discipline,
        category: this.category,
        id: this.id
      }
      // https://database.fig-gymnastics.com/public/results/display/14806?backUrl=&idAgeCategory=10&idCategory=82&idFederation=
      this.$store.dispatch('fetchResults', payload)
    }
  },
  beforeMount() {
    this.$store.dispatch('fetchResultForms', {from: '', to: ''})
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hidden {
  visibility: hidden;
}

</style>
