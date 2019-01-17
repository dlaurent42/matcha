<template>
  <b-container>
    <b-row>
      <v-match
      v-for="(person, index) in persons"
      v-bind:key="index"
      v-bind:person="person"
      ></v-match>
    </b-row>
  </b-container>
</template>

<script>
import axios from 'axios'
import SoloMatch from '../components/SoloMatch'
export default {
  name: 'Contact',
  components: {
    'v-match': SoloMatch
  },
  data () {
    return {
      persons: []
    }
  },
  methods: {
    getInitialUsers () {
      for (var i = 0; i < 6; i++) {
        axios.get(`https://randomuser.me/api/`).then(response => {
          this.persons.push(response.data.results[0])
        })
      }
    }
  },
  beforeMount () {
    this.getInitialUsers()
  }
}
</script>
<style scoped>
</style>
