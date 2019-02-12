<template>
  <div id="wrapper">
    <v-header
      v-bind:logged="authenticated"
      @logout="logout"
      class="fixed-value"
      v-bind:socket="socket"
    />
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
        @logout="logout"
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

import Footer from '@/components/Footer'
import Menu from '@/components/Menu'
import token from '@/services/Token'
import router from '@/router'

import io from 'socket.io-client'
import _ from 'lodash'

import { isEmpty } from '@/utils/obj/isEmpty'
import { library } from '@fortawesome/fontawesome-svg-core'

import {
  faPaperPlane, faSpinner, faCog,
  faHeart, faCode, faArchway, faBell,
  faTimes, faArrowDown, faArrowUp
} from '@fortawesome/free-solid-svg-icons'

library.add([
  faHeart, faTimes, faArrowDown, faArrowUp,
  faSpinner, faArchway, faCode,
  faPaperPlane, faCog, faBell
])

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
    setComplete () { this.profileComplete = true },
    setIncomplete () { this.profileComplete = false },
    setNull () {
      this.authenticated = false
      if (!_.isEmpty(this.socket)) { this.socket.close() }
      this.socket = null
      localStorage.removeItem('userLogged')
      localStorage.removeItem('userID')
    },
    verifyValues () {
      const userLogged = localStorage.getItem('userLogged')
      const userID = localStorage.getItem('userID')
      return (!isEmpty(userLogged) && userLogged && !isEmpty(userID))
    },
    setAuthenticated (response) {
      this.authenticated = 'true'
      this.user = response.data.user
      this.profileComplete = response.data.user.isProfileComplete
      localStorage.setItem('userLogged', true)
      localStorage.setItem('userID', JSON.stringify(response.data.user.id))
      if (this.socket === null) {
        this.socket = io('http://localhost:8082')
        this.socket.on('connect', () => {
          this.socket.emit('loginUser', User.getID())
        })
      }
    },
    logout () {
      User.logout()
      this.setNull()
      router.push('/')
    }
  },
  mounted () {
    if (this.$router.history.current.name === 'Liked') this.classBase = 'fill-space-horizontal'
  },
  beforeMount () {
    User.auth()
    this.authenticated = this.verifyValues()
    if (this.authenticated === true) {
      User.get()
        .then(success => {
          if (token.createToken(success) === localStorage.getItem('authClient')) {
            this.user = success.data.user
            this.profileComplete = success.data.user.isProfileComplete
          } else { alert('FAIAIIAIAIAIAIAILELELELLEELELELE') }
        })
        .catch(err => {
          console.dir(err)
          this.setNull()
        })
      if (this.socket === null && this.verifyValues()) {
        this.socket = io('http://localhost:8082')
        this.socket.on('connect', () => {
          this.socket.emit('loginUser', User.getID())
        })
        this.socket.on('logout', () => {
          this.authenticated = false
          this.socket.close()
          this.socket = null
        })
        this.socket.on('disconnect', () => {
          this.socket.close()
          this.socket = null
        })
      }
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
