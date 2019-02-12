<template>
    <b-row
      v-if="contentReady === true"
      class="justify-content-md-center self-align-start"
      v-bind:style="{ 'background-image': 'url(' + img + ')' }"
    >
        <b-row class="justify-content-md-center bg-dark w-100 pb-2 m-0">
          <b-col col md="12" lg="10">
            <b-row>
              <b-col md="2"><p class="text-white">Sort by :</p></b-col>
              <b-col md="10">
                <template v-for="option in sorts">
                  <b-button
                    v-bind:key="option.key"
                    v-model="option.active"
                    @click="setActive(option)"
                    variant="outline-info"
                    class="mr-2 mb-2"
                    v-bind:class="{'active': option.active }"
                  > {{ option.name }}</b-button>
                </template>
                <b-button @click="changeSort">
                  <font-awesome-icon v-if="ascendant === false" :icon="['fas', 'arrow-up']"/>
                  <font-awesome-icon v-else :icon="['fas', 'arrow-down']"/>
                </b-button>
              </b-col>
            </b-row>
            <b-row class="mt-4">
              <b-col md="2">
                <p class="text-white">Filters :</p>
                <b-button
                  variant="info"
                  @click="getInitialUsers"
                >
                  Fetch
                </b-button>
              </b-col>
              <b-col md="10">
                <b-row>
                  <template v-for="(value, key, index) in filters">
                    <b-form-group
                      class="col-md-3 text-white"
                      :key="key"
                      :id="'fieldset' + index"
                      :label="'Enter ' + key.split('_').reverse().join(' ')"
                      :label-for="key + index"
                  >
                    <b-input
                      :id="key + index"
                      v-bind:key="key"
                      v-model="filters[key]"
                      type="number"
                      v-bind:min="getMin(key)"
                      v-bind:max="getMax(key)"
                      variant="outline-info"
                    >
                    </b-input>
                  </b-form-group>
                  </template>
                </b-row>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-row class="justify-content-sm-center w-100 pt-5 m-0">
          <b-col col md="12" lg="10" class="m-0 px-0">
            <transition-group name="list-complete" tag="div" class="card-columns">
              <v-match
                v-for="person in persons"
                v-bind:key="person.id"
                v-bind:person="person"
                v-bind:socket="socket"
                v-on:like="like"
                v-on:block="block"
                class="list-complete-item"
              />
            </transition-group>
          </b-col>
        </b-row>
        <b-row v-if="persons.length == 0" class="justify-content-sm-center w-100 pt-5 m-0">
          <b-col col md="12" lg="10" class="m-0 px-0">
            <b-jumbotron header="No user found">
              <p>Please change your filters</p>
            </b-jumbotron>
          </b-col>
        </b-row>
    </b-row>
</template>
<script>
import User from '@/services/User'
import _ from 'lodash'
import router from '@/router'
import MultiMatch from '@/components/MultiMatch'

export default {
  name: 'Match',
  components: {
    'v-match': MultiMatch
  },
  props: ['authenticated', 'socket', 'profileComplete'],
  data () {
    return {
      matches: [],
      persons: [],
      ascendant: true,
      contentReady: false,
      img: '',
      filters: {
        age_min: 18,
        age_max: 99,
        distance_min: '',
        distance_max: ''
      },
      sorts: [
        { name: 'age', active: false },
        { name: 'popularity', active: false },
        { name: 'distance', active: false },
        { name: 'interests', active: false },
        { name: 'default', active: true }
      ]
    }
  },
  methods: {
    getInitialUsers () {
      const filters = new Array(this.filters)
      Object.assign(filters, { is_match: '0' })
      User.getAll({
        'filters': filters,
        'sort': this.getSort()
      }).then(success => {
        this.matches = this.ascendant ? [...success.data] : [...success.data].reverse()
        this.persons = this.matches.splice(0, 5)
        this.contentReady = true
      })
    },
    remove (id) { this.persons = this.persons.filter(person => person.id !== id) },
    add (number) {
      for (let a = 0; a < number; a++) {
        if (this.matches.length !== 0) {
          const add = this.matches.shift()
          this.persons.push(add)
        }
      }
    },
    changeSort () {
      this.ascendant = !this.ascendant
      this.getInitialUsers()
    },
    like (id) {
      const userID = localStorage.getItem('userID')
      User.like(userID, id)
        .then(success => {
          this.remove(id)
          this.add(1)
        })
        .catch(err => console.dir(err))
    },
    setActive (option) {
      if (this.getSort() !== option.name) {
        _.map(this.sorts, o => { o.active = o.name === option.name })
        this.getInitialUsers()
      }
    },
    block (id) {
      const userID = localStorage.getItem('userID')
      User.block(userID, id)
        .then(success => {
          this.remove(id)
          this.add(1)
        })
        .catch(err => console.dir(err))
    },
    getHeight () {
      let e = document.documentElement
      return e.scrollHeight - e.scrollTop - e.clientHeight < 50
    },
    getSort () {
      const sort = _.find(this.sorts, o => o.active === true).name
      return sort === undefined ? '' : sort
    },
    scroll () { window.onscroll = () => { if (this.getHeight()) { this.add(2) } } },
    getMin (key) { return (key === 'age_min' || key === 'age_max') ? 18 : 0 },
    getMax (key) { return (key === 'age_min' || key === 'age_max') ? 99 : 10000 }
  },
  beforeMount () {
    if (this.authenticated === false) router.push('/')
    User.get()
      .then(success => {
        if (success.data.user.isProfileComplete === 0) router.push('/Profile')
        else {
          this.getInitialUsers()
          this.img = 'http://getwallpapers.com/wallpaper/full/f/c/3/43246.jpg'
        }
      })
      .catch(err => console.dir(err))
  },
  mounted () {
    this.scroll(this.person)
    console.log('Mount')
  },
  beforeCreated () {
    console.log('beforeCreated')
  },
  created () {
    console.log('Created')
  },
  beforeUpdated () {
    console.log('beforeUpdated')
  },
  updated () {
    console.log('Updated')
  },
  destroyed () {
    console.log('destroy')
  },
  beforeDestroyed () {
    console.log('before destroy')
  }
}
</script>
<style scoped>
.btn-group label {
  margin-right: 5px;
}
@media (max-width: 680px) {
  .card-columns {
    column-count: 1;
  }
}
@media (max-width: 780px) {
  .card-columns {
    column-count: 2;
  }
}
@media (min-width: 992px) {
  .card-columns {
    column-count: 4;
  }
}
</style>
