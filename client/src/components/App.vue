<template>
  <div id="wrapper">
    <v-header class="fixed-value" v-bind:userLogged="userLogged" @clicked="logout"></v-header>
    <b-container class="fill-space" v-bind:style="{ 'background-image': 'url(' + image + ')' }" fluid>
      <router-view/>
    </b-container>
    <v-footer class="fixed-value"></v-footer>
  </div>
</template>

<script>
import User from '@/services/User'
import Menu from '@/components/Menu.vue'
import Footer from '@/components/Footer.vue'
import Notif from '@/components/Notif.vue'
import { isEmpty } from '@/utils/obj/isEmpty'

export default {
  name: 'App',
  components: {
    'v-header': Menu,
    'v-footer': Footer,
    'v-notif': Notif
  },
  data () {
    return {
      image: require('../assets/backgrouds/headerbg.jpg'),
      userLogged: false,
      user: null
    }
  },
  beforeMount () {
    this.authentificate()
  },
  methods: {
    async authentificate () {
      const response = User.auth()
      if (!isEmpty(response)) this.userLogged = true
    },
    async logout (value) {
      User.logout()
    }
  },
  mounted () {
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
</style>
