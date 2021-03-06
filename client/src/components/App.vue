<template>
  <div id="wrapper">
    <v-header
      v-bind:logged="authenticated"
      v-bind:profileComplete="profileComplete"
      @logout="logout"
      class="fixed-value"
      v-bind:socket="socket"
    />
    <b-container v-bind:class="this.classBase" v-bind:style="{
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
import token from '@/services/Token' //eslint-disable-line
import router from '@/router'

import io from 'socket.io-client'
import _ from 'lodash' //eslint-disable-line

import { isEmpty } from '@/utils/obj/isEmpty'
import { library } from '@fortawesome/fontawesome-svg-core'

import {
  faHeart as farHeart
} from '@fortawesome/free-regular-svg-icons'

import {
  faPaperPlane, faSpinner, faCog,
  faHeart, faCode, faArchway, faBell,
  faTimes, faArrowDown, faArrowUp
} from '@fortawesome/free-solid-svg-icons'

library.add([
  faHeart, farHeart, faTimes, faArrowDown, faArrowUp,
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
      this.profileComplete = false
      localStorage.removeItem('userLogged')
      localStorage.removeItem('userID')
    },
    verifyValues () {
      const userLogged = localStorage.getItem('userLogged')
      const userID = localStorage.getItem('userID')
      return (!isEmpty(userLogged) && userLogged && !isEmpty(userID))
    },
    setAuthenticated (response) {
      this.authenticated = true
      this.user = response.data.user
      this.profileComplete = response.data.user.isProfileComplete !== 0
      localStorage.setItem('userLogged', true)
      localStorage.setItem('userID', response.data.user.id)
      this.setSockets(parseInt(response.data.user.id))
    },
    logout () {
      if (!_.isEmpty(this.socket)) {
        this.socket.emit('logoutUser', User.getID())
        this.socket = null
      }
      User.logout()
      this.setNull()
      router.push('/')
    },
    setSockets (id) {
      if (_.isEmpty(this.socket)) {
        this.socket = io('http://localhost:8082')
        this.socket.emit('loginUser', id)
        this.socket.on('logout', () => {
          this.setNull()
          if (!_.isEmpty(this.socket)) {
            this.socket.close()
            this.socket = null
          }
          router.push('/')
        })
      }
    },
    getUser () {
      User.get()
        .then(success => {
          this.user = success.data.user
          this.profileComplete = (success.data.user.isProfileComplete === 1)
          this.setSockets(success.data.user.id)
        })
        .catch(() => { this.setNull() })
    }
  },
  mounted () {
    if (this.$router.history.current.name === 'Liked' ||
    this.$router.history.current.name === 'Match') this.classBase = 'fill-space-horizontal'
    else this.classBase = 'fill-space'
  },
  beforeRouteEnter (to, from, next) {
    if (next.name === 'Liked' || next.name === 'Match') this.classBase = 'fill-space-horizontal'
    else this.classBase = 'fill-space'
    next(this.getUser())
  },
  beforeRouteLeave (to, from, next) {
    if (next.name === 'Liked' || next.name === 'Match') this.classBase = 'fill-space-horizontal'
    else this.classBase = 'fill-space'
    next()
  },
  beforeMount () {
    this.authenticated = this.verifyValues()
    if (this.authenticated) this.setSockets(localStorage.getItem('userID'))
    if (this.authenticated) this.getUser()
  },
  computed: {
    getClass () {
      return this.classBase
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
