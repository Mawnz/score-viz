<template>
  <v-content>
    <v-data-table
      :headers="headers"
      :items="resultsList"
      hide-actions
      class="elevation-4"
    >
      <template slot="headers" slot-scope="props">
        <tr>
          <th v-for="header in props.headers">{{header}}</th>
        </tr>
      </template>
      <template slot="items" slot-scope="props">
        <td v-for="col in props.item" class="subheading">{{col}}</td>
      </template>
    </v-data-table>
  </v-content>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'Results',
  data() {
    return {
      headers: [],
      resultsList: [],
    }
  },
  computed: {
    ...mapGetters(['results']),
  },
  watch: {
    results() {
      if(this.results){
        this.headers = Object.keys(this.results[0])
        this.resultsList = this.results
      }
    }
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hidden {
  visibility: hidden;
}
.v-datatable {
  height: 100px;
  overflow-y: auto;
}
</style>
