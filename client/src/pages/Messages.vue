<template>
  <div class="container bg-white mt-5 p-5">
    <h3 class="text-left text-dark py-2">Messaging</h3>
    <div class="messaging mt-4">
      <div class="inbox_msg">
        <div class="inbox_people">
          <div class="headind_srch">
            <div class="recent_heading">
              <h4>Recent</h4>
            </div>
            <div class="srch_bar">
              <div class="stylish-input-group">
                <input type="text" class="search-bar" placeholder="Search">
                <span class="input-group-addon">
                  <button type="button">
                    <i class="fa fa-search" aria-hidden="true"></i>
                  </button>
                </span>
              </div>
            </div>
          </div>
          <div class="inbox_chat">
            <v-message v-bind:user="user" v-bind:message="message"></v-message>
            <v-message v-bind:user="user" v-bind:message="message"></v-message>
            <v-message v-bind:user="user" v-bind:message="message"></v-message>
            <v-message v-bind:user="user" v-bind:message="message"></v-message>
            <v-message v-bind:user="user" v-bind:message="message"></v-message>
          </div>
        </div>
        <div class="mesgs">
          <div class="msg_history">
              <v-receive></v-receive>
              <v-receive></v-receive>
              <v-receive></v-receive>
              <v-sent></v-sent>
              <v-sent></v-sent>
              <v-sent></v-sent>
          </div>
          <div class="type_msg">
            <div class="input_msg_write">
              <input type="text" class="write_msg" placeholder="Type a message">
              <button class="msg_send_btn" type="button">
                <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import lastMessage from '@/components/lastMessage'
import SentMessage from '@/components/SentMessage'
import ReceiveMessage from '@/components/ReceiveMessage'
export default {
  name: 'Message',
  components: {
    'v-message': lastMessage,
    'v-sent': SentMessage,
    'v-receive': ReceiveMessage
  },
  methods: {
    getMessages () {
      return ''
    }
  },
  data () {
    return {
      user: {
        lastname: 'Hello',
        firstname: 'World',
        img: 'https://ptetutorials.com/images/user-profile.png'
      },
      message: {
        date: 'Today',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do'
      }
    }
  }
}
</script>
<style scoped>
.container { max-width:1170px; margin:auto; }

.inbox_people { background: #f8f8f8 none repeat scroll 0 0; float: left; overflow: hidden; width: 40%; border-right:1px solid #c4c4c4; }
.inbox_chat { height: 550px; overflow-y: scroll;}
.inbox_msg { border: 1px solid #c4c4c4; clear: both; overflow: hidden; }

.top_spac{ margin: 20px 0 0;}
.recent_heading {float: left; width:40%;}
.recent_heading h4 { color: #05728f; font-size: 21px; margin: auto; }

.headind_srch{ padding:10px 29px 10px 20px; overflow:hidden; border-bottom:1px solid #c4c4c4;}

.srch_bar { display: inline-block; text-align: right; width: 60%; }
.srch_bar input{ border:1px solid #cdcdcd; border-width:0 0 1px 0; width:80%; padding:2px 0 4px 6px; background:none;}
.srch_bar .input-group-addon { margin: 0 0 0 -27px;}
.srch_bar .input-group-addon button {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  padding: 0;
  color: #707070;
  font-size: 18px;
}

.mesgs { float: left; padding: 30px 15px 0 25px; width: 60%; }
.messaging { padding: 0 0 50px 0;}

.input_msg_write input {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  color: #4c4c4c;
  font-size: 15px;
  min-height: 48px;
  width: 100%;
}

.type_msg {border-top: 1px solid #c4c4c4;position: relative;}

.msg_send_btn {
  background: #05728f none repeat scroll 0 0;
  border: medium none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  font-size: 17px;
  height: 33px;
  position: absolute;
  right: 0;
  top: 11px;
  width: 33px;
}

.msg_history { height: 516px; overflow-y: auto; }

</style>