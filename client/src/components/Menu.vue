<template>
  <b-navbar toggleable="md" type="dark" variant="dark">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-navbar-brand href="#">Matcha</b-navbar-brand>
    <v-notif v-if="logged === 'true'" v-bind:socket="socket"></v-notif>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav class="m-auto">
        <b-nav-item><router-link to="/" class="nav-link">Home</router-link></b-nav-item>
        <b-nav-item><router-link to="/About" class="nav-link">About</router-link></b-nav-item>
        <b-nav-item><router-link to="/Services" class="nav-link">Services</router-link></b-nav-item>
        <b-nav-item><router-link to="/Contact" class="nav-link">Contact</router-link></b-nav-item>
      </b-navbar-nav>
    </b-collapse>
    <b-navbar-nav class="ml-auto" v-if="logged === 'true'" id="profile">
      <b-dropdown variant="link" size="lg" offset="-100" no-caret>
        <template slot="button-content">
          <font-awesome-icon icon="cog"/>
        </template>
        <b-dropdown-item><router-link to="/Profile" class="nav-link text-dark">Profile</router-link></b-dropdown-item>
        <b-dropdown-item><router-link to="/Messages" class="nav-link text-dark">Messages</router-link></b-dropdown-item>
        <b-dropdown-item><router-link to="/MatchQuick" class="nav-link text-dark">Match</router-link></b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item-button v-on:click="logout()">Logout</b-dropdown-item-button>
      </b-dropdown>
    </b-navbar-nav>
    <b-navbar-nav v-else id="nav">
      <b-nav-item><router-link to="/login" class="nav-link">Login</router-link></b-nav-item>
      <b-nav-item><router-link to="/register" class="nav-link">Register</router-link></b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import Notif from '@/components/Notifications'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCog } from '@fortawesome/free-solid-svg-icons'

library.add(faCog)

export default {
  name: 'Menu',
  props: ['logged', 'socket'],
  components: {
    'v-notif': Notif
  },
  data () {
    return {
    }
  },
  methods: {
    logout (event) {
      this.$emit('clicked', 'someValue')
    }
  }
}
</script>
<style scoped>
.btn-link svg {
  color:white;
}
.btn-link:hover svg {
  color:#05728f;
}
.navbar-toggler {
  margin-right: 10px;
}
</style>
