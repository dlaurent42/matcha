<template>
  <b-container fluid class="h-100 mt-5">
    <b-row class="justify-content-md-center">
      <b-col
        md="8"
        lg="8"
        v-for="(notification, index) in history"
        v-bind:key="notification.id"
        class="mt-1"
      >
        <b-card class="bg-dark-transparent">
          <b-row>
            <b-col md="12">
              <span class="text-left">
                  {{ index + 1}} |
              </span>
              <span class="text-center">
                <router-link :to="profilePath(notification.emitter_id)">
                  {{ notification.emitter_username }}
                </router-link>
                  {{ getMessage(notification.type) }}
              </span>
              <span class="float-right"> {{ getDate(notification.date) }} </span>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import User from '@/services/User'
import FormatDate from '@/services/FormatDate'
import router from '@/router'
import MatchButton from '@/components/MatchButton'
import _ from 'lodash' //eslint-disable-line
export default {
  name: 'History',
  props: ['socket', 'isProfileComplete'],
  components: {
    'v-button': MatchButton
  },
  methods: {
    getHistory () {
      User.getNotifications()
        .then(success => {
          this.history = success.data.notifications
        })
        .catch(() => {})
    },
    profilePicture (path) {
      return 'http://localhost:8081/assets/' + path
    },
    profilePath (id) {
      return '/Profile/' + id
    },
    getMessage (type) { return this.type.get(type) },
    getDate (date) { return FormatDate.historyDate(date) }
  },
  data () {
    return {
      history: [],
      type: new Map([
        ['like', 'likes your profile'],
        ['message', 'sent you a message'],
        ['view', 'has seen your profile'],
        ['match', 'has matched with you'],
        ['profile', 'has seen your profile'],
        ['unlike', 'no longer likes your profile']
      ])
    }
  },
  beforeMount () {
    if (this.authenticated === false) router.push('/')
    User.get()
      .then(success => {
        if (success.data.user.isProfileComplete === 0) router.push('/Profile')
        else this.getHistory()
      })
      .catch(() => {})
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
