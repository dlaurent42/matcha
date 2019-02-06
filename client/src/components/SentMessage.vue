<template>
  <div class="outgoing_msg" @click="toggle">
    <div class="sent_msg">
        <p>{{ this.message.content }} </p>
      <span v-show="hidden" class="time_date">{{ getDate }}</span>
    </div>
  </div>
</template>
<script>
import Format from '@/services/FormatDate'
import User from '@/services/User'
export default {
  name: 'SentMessage',
  data: () => {
    return {
      hidden: false,
      messageText: 'hello world',
      username: 'Chuck Norris',
      image: 'https://ptetutorials.com/images/user-profile.png'
    }
  },
  mounted () {
    this.getProfilePic()
    this.hidden = this.last
  },
  props: ['user', 'message', 'last'],
  methods: {
    getProfilePic () {
      User.getProfilePic(this.user.id)
        .then(success => { this.image = success })
        .catch(() => {})
    },
    toggle () {
      this.hidden = !this.hidden
    }
  },
  computed: {
    getDate () {
      return Format.messageDate(this.message.date)
    }
  }
}
</script>
<style scoped>
.received_withd_msg p {
  background: #ebebeb none repeat scroll 0 0;
  border-radius: 3px;
  color: #646464;
  font-size: 14px;
  margin: 0;
  padding: 5px 10px 5px 12px;
  width: 100%;
}
.time_date {
  color: #747474;
  display: block;
  font-size: 12px;
  margin: 8px 0 0;
}
.sent_msg p {
  background: #05728f none repeat scroll 0 0;
  border-radius: 3px;
  font-size: 14px;
  margin: 0; color:#fff;
  padding: 5px 10px 5px 12px;
  width:100%;
}
.outgoing_msg {
  overflow:hidden;
  margin: 15px 0 15px;
}
.sent_msg {
  float: right;
  width: 46%;
}
</style>
