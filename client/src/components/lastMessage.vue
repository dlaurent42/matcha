<template>
  <div class="chat_list active_chat" v-on:click='refresh'>
    <div class="chat_people">
      <div class="chat_img">
        <img v-bind:src="image">
      </div>
      <div class="chat_ib">
        <h5> {{ user.username }}
          <span class="chat_date">{{ getDate }}</span>
        </h5>
        <p>
          {{ message.content }}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import Format from '@/services/FormatDate'
import _ from 'lodash'
import User from '@/services/User'
export default {
  name: 'lastMessage',
  props: ['user', 'message'],
  data () {
    return {
      image: 'https://ptetutorials.com/images/user-profile.png'
    }
  },
  methods: {
    getProfilePic () {
      if (this.user.id !== undefined) {
        User.getProfilePic(this.user.id)
          .then(success => { this.image = success })
          .catch(err => console.dir(err))
      }
    },
    refresh () {
      this.$emit('refresh', this.user.id)
    }
  },
  computed: {
    getDate () {
      return _.isEmpty(this.user.lastMessageDate) ? 'No Message Baby' : Format.fullDate(this.user.lastMessageDate)
    }
  },
  mounted () {
    this.getProfilePic()
  }
}
</script>
<style scoped>
img{ max-width:100%;}

.chat_ib h5{ font-size:15px; color:#464646; margin:0 0 8px 0;}
.chat_ib h5 span{ font-size:13px; float:right;}
.chat_ib p{ font-size:14px; color:#989898; margin:auto}
.chat_img {
  float: left;
  width: 11%;
}
.chat_ib {
  float: left;
  padding: 0 0 0 15px;
  width: 88%;
}
.chat_people{ overflow:hidden; clear:both;}
.chat_list {
  border-bottom: 1px solid #c4c4c4;
  margin: 0;
  padding: 18px 16px 10px;
}
.chat_list:hover {
  cursor: pointer;
  background-color: #05728f;
}
.chat_list:hover .chat_ib p,
.chat_list:hover .chat_ib h5
{
  color:white;
}
</style>
