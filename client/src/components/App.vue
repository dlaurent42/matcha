<template>
  <div id="wrapper">
    <v-header v-bind:logged="authenticated" class="fixed-value" @clicked="logout" v-bind:socket="socket"></v-header>
    <b-container v-bind:class="classBase" v-bind:style="{
      'background-image': 'url(' + image + ')',
      'background-repeat': 'no-repeat',
      'background-attachment': 'fixed',
      'background-position': 'center',
      'background-size': 'cover'
    }" fluid>
      <router-view
        @authenticated="setAuthenticated"
        @profileComplete="setComplete"
        @profileNotComplete="setIncomplete"
        v-bind:authenticated="authenticated"
        v-bind:profileComplete="profileComplete"
        v-bind:socket="socket"
      />
    </b-container>
    <v-footer class="fixed-value"></v-footer>
  </div>
</template>

<script>
import User from '@/services/User'
import axios from 'axios' //eslint-disable-line
import Menu from '@/components/Menu'
import Footer from '@/components/Footer'
import router from '@/router'
import io from 'socket.io-client'
import { isEmpty } from '@/utils/obj/isEmpty'

export default {
  name: 'App',
  components: {
    'v-header': Menu,
    'v-footer': Footer
  },
  data () {
    return {
      classBase: 'fill-space',
      image: require('../assets/backgrouds/headerbg.jpg'),
      authenticated: false,
      profileComplete: false,
      socket: null,
      user: ''
    }
  },
  methods: {
    setComplete () {
      this.profileComplete = true
    },
    setIncomplete () { this.profileComplete = false },
    setAuthenticated (response) {
      this.authenticated = 'true'
      this.user = response.data.user
      this.profileComplete = response.data.user.isProfileComplete
      sessionStorage.setItem('userLogged', true)
      sessionStorage.setItem('userID', JSON.stringify(response.data.user.id))
      if (this.socket === null) {
        this.socket = io('http://localhost:8082')
        this.socket.on('connect', () => {
          this.socket.emit('loginUser', User.getID())
        })
      }
    },
    logout () {
      User.logout()
      this.authenticated = false
      this.socket.emit('logoutUser')
      sessionStorage.removeItem('userLogged')
      sessionStorage.removeItem('userID')
      this.socket.emit('logoutUser', User.getID())
      router.push('/')
    }
  },
  mounted () {
    if (this.$router.history.current.name === 'Liked') this.classBase = 'fill-space-horizontal'
    if (this.authenticated === 'true') {
      User.get()
        .then(success => {
          this.user = success.data.user
          this.profileComplete = success.data.user.isProfileComplete
          console.log(this.profileComplete)
        })
    }
  },
  beforeMount () {
    User.auth()
    const userLogged = sessionStorage.getItem('userLogged')
    this.authenticated = (!isEmpty(userLogged) && userLogged)
    if (this.socket === null && userLogged) {
      this.socket = io('http://localhost:8082')
      this.socket.on('connect', () => {
        this.socket.emit('loginUser', User.getID())
      })
      this.socket.on('disconnect', () => {
        this.socket.open()
      })
    }
  }
}
</script>
<style scoped>
#wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.fill-space {
  flex:1;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -ms-flex-pack: distribute;
  justify-content: space-around;
  flex: 1 100%;
}
.fill-space-horizontal {
  flex:1;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: row;
  -ms-flex-pack: distribute;
  justify-content: space-around;
  flex: 1 100%;
}
</style>
