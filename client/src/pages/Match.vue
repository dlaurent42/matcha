<template>
    <b-row class="justify-content-md-center pt-5" v-bind:style="{ 'background-image': 'url(' + img + ')' }">
        <b-col col md="12" lg="10">
          <transition-group name="list-complete" tag="div" class="card-columns">
            <v-match
              v-for="person in persons"
              v-bind:key="person.id"
              v-bind:person="person"
              v-on:like="like"
              v-on:block="block"
              class="list-complete-item"
            ></v-match>
          </transition-group>
        </b-col>
    </b-row>
</template>
<script>
import User from '@/services/User'
import router from '@/router'
import MultiMatch from '@/components/MultiMatch'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
library.add([faHeart, faTimes])

export default {
  name: 'Match',
  components: {
    'v-match': MultiMatch
  },
  props: ['authenticated'],
  data () {
    return {
      matches: [],
      persons: [],
      img: '',
      filters: {
        age_min: '18',
        age_max: '25',
        distance_min: '',
        distance_max: '',
        popularity_min: '',
        popularity_max: '',
        interests: '',
        matching_score_min: '',
        matching_score_max: '',
        is_match: '0'
      },
      sort: ''
    }
  },
  methods: {
    getInitialUsers () {
      User.getAll({ filters: this.filters, sort: this.sort })
        .then(success => {
          this.matches = [...success.data]
          this.persons = this.matches.splice(0, 5)
        })
    },
    remove (id) {
      this.persons = this.persons.filter(person => person.id !== id)
    },
    add () {
      if (this.matches.length !== 0) {
        const add = this.matches.shift()
        this.persons.push(add)
      }
    },
    like (id) {
      const userID = sessionStorage.getItem('userID')
      User.like(userID, id)
        .then(success => {
          this.remove(id)
          this.add()
        })
        .catch(err => console.dir(err))
    },
    block (id) {
      const userID = sessionStorage.getItem('userID')
      User.block(userID, id)
        .then(success => {
          this.remove(id)
          this.add()
        })
        .catch(err => console.dir(err))
    },
    getHeight () {
      let e = document.documentElement
      return e.scrollHeight - e.scrollTop - e.clientHeight < 50
    },
    scroll (person) {
      window.onscroll = () => { if (this.getHeight()) { this.add() } }
    }
  },
  beforeMount () {
    if (this.authenticated === false) router.push('/')
    this.getInitialUsers()
    this.img = 'http://getwallpapers.com/wallpaper/full/f/c/3/43246.jpg'
  },
  mounted () {
    this.scroll(this.person)
  }
}
</script>
<style scoped>

</style>
