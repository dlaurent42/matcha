<template>
  <b-container>
    <transition-group name="list-complete" tag="div" class="row">
      <v-match
        v-for="person in persons"
        v-bind:key="person.id"
        v-bind:person="person"
        v-bind:socket="socket"
        v-on:like="like"
        v-on:block="block"
        class="list-complete-item"
      ></v-match>
    </transition-group>
  </b-container>
</template>

<script>
import User from '@/services/User'
import _ from 'lodash'
import router from '@/router'
import SoloMatch from '@/components/SoloMatch'
export default {
  name: 'Contact',
  props: ['socket', 'authenticated', 'profileComplete'],
  components: {
    'v-match': SoloMatch
  },
  data () {
    return {
      match: [],
      persons: [],
      filters: { is_match: '0' },
      sort: ''
    }
  },
  methods: {
    getInitialUsers () {
      User.getAll({ filters: this.filters, sort: this.sort })
        .then(success => {
          this.match = _.shuffle([...success.data])
          this.persons = this.match.splice(0, 6)
        })
    },
    remove (id) {
      this.persons = this.persons.filter(person => person.id !== id)
    },
    add () {
      const add = this.match.shift()
      this.persons.push(add)
    },
    like (id) {
      const userID = localStorage.getItem('userID')
      User.like(userID, id)
        .then(success => {
          this.remove(id)
          this.add()
        })
        .catch(err => console.dir(err))
    },
    block (id) {
      const userID = localStorage.getItem('userID')
      User.block(userID, id)
        .then(success => {
          this.remove(id)
          this.add()
        })
        .catch(err => console.dir(err))
    }
  },
  beforeMount () {
    if (this.authenticated === false) router.push('/')
    User.get()
      .then(success => {
        if (success.data.user.isProfileComplete === 0) router.push('/Profile')
        else {
          this.$emit('authenticated', success)
          this.getInitialUsers()
        }
      })
      .catch(err => console.dir(err))
  }
}
</script>
<style scoped>
.list-complete-item {
  transition: all 1s;
}
.list-complete-enter, .list-complete-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>
