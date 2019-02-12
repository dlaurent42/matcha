<template>
  <b-row class="w-100 justify-content-md-center m-0">
    <b-col md="6" cols="12" class="bg-dark left-space">
      <b-card
        class="bg-dark-transparent text-center"
        no-body
      >
      <b-card-body class="col-md-8 offset-md-2">
        <h4>{{ getTitle }}</h4>
        <p class="card-text">
          {{ user.gender }}
        </p>
        <b-img rounded="circle" alt="img" class="m-1" v-bind:src="image"/>
        <p class="card-text">
            {{ user.biography }}
        </p>
        <p class="card-text">
          <b-badge v-if="user.isOnline === true" variant="success">Online</b-badge>
          <b-badge v-else >{{ user.last_connection }}</b-badge>
          Popularity: {{ user.popularity }}
        </p>
        <p class="card-text profile-tags">
          <b-badge
            class="ml-3"
            v-for="interest in user.interests"
            v-bind:key="interest"
            v-bind:variant="`${colors[parseInt((Math.random().toFixed(2) * 100)) % colors.length]}`"
          >
          {{ interest }}
          </b-badge>
        </p>
        <v-btn
          v-bind:liked="liked"
          v-bind:blocked="blocked"
          v-bind:id="user.id"
          v-on:like="like"
          v-on:unlike="unlike"
          v-on:block="block"
          v-on:unblock="unblock"
          v-bind:socket="socket"
        />
      </b-card-body>
      </b-card>
    </b-col>
    <b-col md="6" cols="12">
      <b-card
        class="bg-dark-transparent text-center"
        no-body
      >
      <b-card-body>
        <v-carousel v-bind:isProfile="false" v-bind:pictures="user.pictures"></v-carousel>
      </b-card-body>
      </b-card>
    </b-col>
    <b-col cols="12">
      <b-row>
        <b-col md="6">
          <v-load
              v-bind:loadingState="loadingReport"
              message="Report user"
              variant="danger"
              v-on:update="report"
          />
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import User from '@/services/User'
import _ from 'lodash'
import Carousel from '@/components/Carousel'
import router from '@/router'
import MatchButton from '@/components/MatchButton'
import loadingButton from '@/components/buttonLoading'

export default {
  name: 'UserProfile',
  components: {
    'v-btn': MatchButton,
    'v-carousel': Carousel,
    'v-load': loadingButton
  },
  props: ['socket', 'authenticated', 'profileComplete'],
  data () {
    return {
      user: {
        id: this.$route.params.id,
        isOnline: '',
        pictures: []
      },
      loadingReport: 'false',
      liked: false,
      blocked: false,
      image: 'https://randomuser.me/api/portraits/women/59.jpg',
      colors: [
        'primary',
        'secondary',
        'danger',
        'warning',
        'success',
        'info',
        'light'
      ]
    }
  },
  beforeMount () {
    if (this.authenticated === false) router.push('/')
    User.get()
      .then(success => {
        if (success.data.user.isProfileComplete === 0) router.push('/Profile')
        else {
          this.updateUser()
          this.setButton()
        }
      })
      .catch(err => console.dir(err))
  },
  mounted () {
    this.socket.on('isOnline', data => {
      if (!_.isEmpty(data.data.onlineUsers)) {
        data.data.onlineUsers.forEach(user => {
          if (parseInt(user.id, 10) === parseInt(this.user.id, 10) &&
          user.isOnline === true) this.user.isOnline = true
        })
      }
    })
    this.socket.emit('isOnline', [parseInt(this.user.id)])
  },
  computed: {
    getTitle () { return this.user.fullname + ', ' + this.user.age }
  },
  watch: {
    '$route' (to, from) { this.updateUser() }
  },
  methods: {
    updateUser () {
      User.getUser(this.$route.params.id)
        .then((success) => {
          if (_.isEmpty(success.data.err)) {
            this.user = success.data.user
            this.getProfilePic()
            this.profileSeen()
          } else router.push('/home')
        })
        .catch((err) => console.dir(err))
    },
    getProfilePic () {
      User.getProfilePic(this.user.id)
        .then(success => { this.image = success })
        .catch(err => console.dir(err))
    },
    report () {
      this.loadingReport = 'true'
      const userID = localStorage.getItem('userID')
      User.report(userID, this.user.id)
        .then(success => {
          this.input = success.data.user
          setTimeout(() => { this.loadingReport = 'complete' }, 1500)
        })
        .catch(() => { setTimeout(() => { this.loadingReport = 'error' }, 1500) })
        .finally(setTimeout(() => { this.loadingReport = 'false' }, 3000))
    },
    unlike (id) {
      const userID = localStorage.getItem('userID')
      User.unlike(userID, id)
        .then(success => { this.liked = false })
        .catch(err => console.dir(err))
    },
    like (id) {
      const userID = localStorage.getItem('userID')
      User.like(userID, id)
        .then(success => {
          this.liked = true
          if (this.blocked === true) this.unblock(id)
        })
        .catch(err => console.dir(err))
    },
    block (id) {
      const userID = localStorage.getItem('userID')
      User.block(userID, id)
        .then(success => {
          this.blocked = true
          if (this.liked === true) this.unlike(id)
        })
        .catch(err => console.dir(err))
    },
    unblock (id) {
      const userID = localStorage.getItem('userID')
      User.unblock(userID, id)
        .then(success => { this.blocked = false })
        .catch(err => console.dir(err))
    },
    profileSeen () {
      const receiver = this.$route.params.id
      if (parseInt(receiver, 10) !== parseInt(User.getID(), 10)) {
        User.profileSeen(receiver)
        const notification = { 'receiver': receiver, emitter: User.getID(), type: 'profile' }
        this.socket.emit('notification', notification)
      }
    },
    setButton () {
      User.get().then(success => {
        const likes = success.data.user.likes
        _.each(likes, x => {
          if (parseInt(x.id) === parseInt(this.user.id)) this.liked = true
        })
      })
    }
  }
}
</script>
<style scoped>
.left-space {
  padding: 0;
  flex: 1 100%;
  align-self: flex-start;
  justify-content: center;
  -ms-flex: 1;
  display: flex;
}
img.rounded-circle {
  max-width: 100px;
  max-height: 100px;
}
.bg-dark-transparent {
  background-color:#343a40ad;
  color:rgba(255, 255, 255, 0.8);
  align-self: center;
}
.profile-tags span:not(.badge-light){
  color:white;
}
</style>
