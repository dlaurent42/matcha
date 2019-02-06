<template>
  <div class="incoming_msg" @click="toggle">
    <div class="incoming_msg_img">
      <img v-bind:src="this.image" alt="sunil">
    </div>
    <div class="received_msg">
      <div class="received_withd_msg">
        <p>
          {{ this.message.content }}
        </p>
        <span class="time_date" v-show="hidden">{{ getDate }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import Format from '@/services/FormatDate'
import User from '@/services/User'
export default {
  name: 'ReceiveMessage',
  data: () => {
    return {
      hidden: false,
      messageText: 'hello world',
      username: 'Chuck Norris',
      image: 'https://ptetutorials.com/images/user-profile.png'
    }
  },
  mounted () {
    this.hidden = this.last
    this.getProfilePic()
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
img {
  max-width:100%;
}
.incoming_msg {
  margin: 15px 0 15px;
}
.incoming_msg_img {
  display: inline-block;
  width: 6%;
}
.received_msg {
  display: inline-block;
  padding: 0 0 0 10px;
  vertical-align: top;
  width: 92%;
 }
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
.received_withd_msg { width: 57%;}

</style>
