<template>
  <b-dropdown variant="link" size="lg" no-caret class="max-400">
    <template slot="button-content">
      <font-awesome-icon icon="bell"/>
      <b-badge v-if="getNumber !==0" pill variant="danger"> {{ getNumber }}</b-badge>
    </template>
    <b-dropdown-item disabled v-if="getNumber === 0">
      No new notifications
    </b-dropdown-item>
    <template v-for="user in notifications" v-bind="user">
      <v-notification
        v-for="notif in user"
        v-bind:key="notif[0].notifid"
        v-bind:notification="notif"
        v-on:suppress="suppress"
      />
    </template>
  </b-dropdown>
</template>

<script>
import User from '@/services/User'
import _ from 'lodash'
import Notif from '@/components/Notification'

export default {
  name: 'Notifications',
  props: ['socket'],
  components: {
    'v-notification': Notif
  },
  data () {
    return {
      notifications: []
    }
  },
  mounted () {
    this.getNotifications()
    this.socket.on('message', data => {
      if (this.$route.name !== 'Messages') { this.getNotifications() }
    })
    this.socket.on('notification', data => { this.getNotifications() })
  },
  methods: {
    suppress (notification) {
      this.remove(notification)
    },
    remove (notification) {
      return new Promise((resolve, reject) => {
        let promiseStack = []
        _.each(notification, notif => {
          promiseStack.push(User.suppressNotification(notif.notifid))
        })
        Promise.all(promiseStack)
          .then(this.getNotifications)
      })
    },
    getNotifications () {
      return new Promise((resolve, reject) => {
        User.getNotifications()
          .then(success => {
            this.notifications = success.data.notifications.map(function (elem) {
              const notification = {
                'username': elem.emitter_username,
                'path': 'http://placehold.it/45x45',
                'id': elem.emitter_id,
                'notifid': elem.notification_id,
                'type': elem.type
              }
              return notification
            })
            this.notifications = _.groupBy(this.notifications, 'id')
            this.notifications = _.mapValues(this.notifications, (value, key) => {
              return _.groupBy(value, 'type')
            })
            resolve(true)
          })
          .catch(err => { reject(err) })
      })
    }
  },
  computed: {
    getNumber () {
      let num = 0
      _.each(this.notifications, obj => {
        num += Object.keys(obj).length
      })
      return num
    }
  }
}
</script>
<style scoped>
.fa-bell {
  color:white;
}
.rounded-circle {
  font-size: 10px;
  padding: 0px;
  width: 17px;
}
#__BVID__5__BV_toggle_ > span {
  top: -12px;
  left: -15px;
}

</style>
