<template>
  <b-container fluid class="h-100 mt-5">
    <b-row class="justify-content-md-center">
      <b-col
        md="4"
        v-for="person in userLiked"
        v-bind:key="person.id"
      >
        <b-card v-bind:title="person.username" sub-title="" class="bg-dark-transparent">
          <b-row>
            <div class="card-text text-center col-md-6" >
              <b-button v-bind:href="profilePath(person.id)">
                View profile
              </b-button>
            </div>
            <div class="card-text col-md-6 mb-2">
              <v-button
                v-bind:liked="true"
                v-bind:blocked="false"
                v-bind:id="person.id"
                v-on:unlike="unlike"
                v-on:block="block"
                v-bind:socket="socket"
              />
            </div>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import User from '@/services/User'
import router from '@/router'
import MatchButton from '@/components/MatchButton'
import _ from 'lodash'
export default {
  name: 'Liked',
  props: ['socket', 'isProfileComplete'],
  components: {
    'v-button': MatchButton
  },
  methods: {
    unlike (id) {
      const userID = localStorage.getItem('userID')
      User.unlike(userID, id)
        .then(success => { this.getUsersLiked() })
        .catch(err => console.dir(err))
    },
    block (id) {
      const userID = localStorage.getItem('userID')
      User.block(userID, id)
        .then(success => { this.unlike(id) })
        .catch(err => console.dir(err))
    },
    getUsersLiked () {
      User.get()
        .then(success => {
          this.user = success.data.user
          const liked = this.user.likes
          let promises = []
          _.each(liked, x => { promises.push(User.getUser(x.id)) })
          Promise.all(promises)
            .then(success => { this.userLiked = _.map(success, array => { return array.data.user }) })
        })
        .catch(err => console.dir(err))
    },
    profilePath (path) {
      return '/Profile/' + path
    }
  },
  data () {
    return {
      user: [],
      userLiked: []
    }
  },
  beforeMount () {
    if (this.authenticated === false) router.push('/')
    User.get()
      .then(success => {
        if (success.data.user.isProfileComplete === 0) router.push('/Profile')
        else this.getUsersLiked()
      })
      .catch(err => console.dir(err))
  }
}
</script>
<style scoped>
.fill-space {
  flex:1;
  display: flex;
  flex-direction: row;
  -ms-flex-pack: distribute;
  justify-content: space-around;
  flex: 1 100%;
}
.bg-dark-transparent {
  background-color:#343a40ad;
  color:rgba(255, 255, 255, 0.8);
  height: 100%;
}
#a {
  flex: 1 100%;
}
#b {
  flex: 1 100%;
}
</style>
