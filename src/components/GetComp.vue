<template>
  <v-card class="fill">
    <div class="hidden"></div>
    <v-card-title primary-title>
      <span class="headline">Select competition</span>
    </v-card-title>
    <v-list>
      <template v-for="comp in competitions">
      </template>
    </v-list>
  </v-card>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'GetComp',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
        'competitions'
      ])
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hidden {
  visibility: hidden;
}
</style>
