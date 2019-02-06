<template>
  <b-row class="fill-space">
    <b-col md="6" cols="12" class="left-space bg-dark">
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
          v-bind:id="user.id"
          v-on:like="like"
          v-on:block="block"
          v-bind:socket="socket"
        />
      </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import User from '@/services/User'
import router from '@/router'
import MatchButton from '@/components/MatchButton'

export default {
  name: 'UserProfile',
  components: {
    'v-btn': MatchButton
  },
  props: ['socket'],
  data () {
    return {
      user: {
        id: this.$route.params.id
      },
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
    this.updateUser()
  },
  mounted () {
    this.getProfilePic()
    this.profileSeen()
  },
  computed: {
    getTitle () { return this.user.fullname + ', ' + this.user.age }
  },
  watch: {
    '$route' (to, from) {
      this.updateUser()
    }
  },
  methods: {
    updateUser () {
      User.getUser(this.$route.params.id)
        .then((success) => {
          this.user = success.data.user
          console.log(success)
        })
        .catch((err) => console.dir(err))
    },
    getProfilePic () {
      User.getProfilePic(this.user.id)
        .then(success => { this.image = success })
        .catch(err => console.dir(err))
    },
    like (id) {
      const userID = sessionStorage.getItem('userID')
      User.like(userID, id)
        .then(success => {
          // this.remove(id)
          // this.add()
        })
        .catch(err => console.dir(err))
    },
    block (id) {
      const userID = sessionStorage.getItem('userID')
      User.block(userID, id)
        .then(success => {
          // this.remove(id)
          // this.add()
        })
        .catch(err => console.dir(err))
    },
    profileSeen () {
      const receiver = this.$route.params.id
      User.profileSeen(receiver)
      const notification = { 'receiver': receiver, emitter: User.getID(), type: 'profile' }
      this.socket.emit('notification', notification)
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
.bg-dark-transparent {
  background-color:#343a40ad;
  color:rgba(255, 255, 255, 0.8);
  align-self: center;
}
.profile-tags span:not(.badge-light){
  color:white;
}
</style>
