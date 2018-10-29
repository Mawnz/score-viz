<template>
  <div v-if="loading" class="loading" :class="{'active': loading}">
    <v-progress-circular
      :size="100"
      color="primary"
      indeterminate
    >
  </v-progress-circular>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'Loading',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'loading'
    ]),
  },
  watch: {
    loading(){
    }
  },
  methods: {
  },
  beforeMount() {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.loading {
  position: fixed;
  z-index: 99;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.5s ease;

  display: flex;
  justify-content: center;
  align-items: center;

  &.active {
    opacity: 1;
  }
}
</style>
