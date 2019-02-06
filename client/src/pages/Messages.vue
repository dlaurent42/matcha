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
            <v-message
              v-for="user in users"
              v-bind:key="user.id"
              v-bind:user="user"
              v-bind:message="message"
              v-on:click='getMessages'
              v-on:refresh="refresh"
            />
          </div>
        </div>
        <div class="mesgs">
          <div class="msg_history" id="msg-box">
            <v-wrapper
              v-for="(msg, index) in messages"
              v-bind:key="msg.id"
              v-bind:user="currentUser"
              v-bind:message="msg"
              v-bind:last="index === messages.length - 1"
            />
          </div>
          <div class="type_msg">
            <div class="input_msg_write">
              <input type="text" class="write_msg"  v-on:keyup.enter="sendMessage" placeholder="Type a message" id="sendMessage">
              <button class="msg_send_btn" type="button" v-on:click="sendMessage">
                <font-awesome-icon icon="paper-plane" size="1x" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import User from '@/services/User'
import LastMessage from '@/components/lastMessage'
import WrapperMessage from '@/components/WrapperMessage'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

library.add(faPaperPlane)

export default {
  name: 'Message',
  components: {
    'v-message': LastMessage,
    'v-wrapper': WrapperMessage
  },
  props: ['socket'],
  data () {
    return {
      users: {},
      currentUser: {},
      message: {},
      messages: {},
      scrollHeigh: 0
    }
  },
  methods: {
    getConversation () {
      return new Promise((resolve, reject) => {
        User.getConversation()
          .then(success => {
            const map = new Map()
            success.data.conversations.forEach(a => map.set(a.id, a))
            this.users = [...map.values()].reverse()
            if (this.users[0] !== undefined) resolve(this.users[0])
            else reject(Error('no conversation'))
          })
          .catch(err => { reject(err) })
      })
    },
    sendMessage (content) {
      const message = document.getElementById('sendMessage').value
      const receiver = this.currentUser.id
      if (message !== '' || message !== null || message !== undefined) {
        User.sendMessage(receiver, message)
          .then(success => {
            this.socket.emit('message', { content: message, emitter: User.getID(), 'receiver': receiver })
            document.getElementById('sendMessage').value = ''
            this.getMessages(this.currentUser.id)
          })
          .catch(err => { console.dir(err) })
      }
    },
    async getMessages (receiver) {
      try {
        await User.getMessages(receiver)
          .then(success => {
            this.messages = success.data.messages.reverse()
          })
      } // eslint-disable-line
      catch (e) { console.dir(e) }
    },
    refresh (userId) {
      this.getMessages(userId)
      User.getUser(userId)
        .then(success => { this.currentUser = success.data.user })
        .catch(err => console.dir(err))
    }
  },
  computed: {
    getID () { return User.getID() }
  },
  updated () {
    const box = document.getElementById('msg-box')
    box.scrollTop = box.scrollHeight
  },
  beforeMount () {
    this.getConversation()
      .then(success => {
        this.currentUser = success
        this.getMessages(success.id)
      })
      .catch(err => console.log(err))
    this.socket.on('message', data => {
      if (parseInt(data.data.emitter) === this.currentUser.id) this.getMessages(this.currentUser.id)
    })
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

.input_msg_write {
  padding: 2px;
}
.input_msg_write input {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  padding-left: 5px;
  overflow-x: scroll;
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
#sendMessage:focus {
  border: transparent;
  outline: 0;
}
.msg_history { height: 516px; overflow-y: auto; }

</style>
