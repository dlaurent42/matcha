<template>
  <div class="incoming_msg">
    <div class="incoming_msg_img">
      <img v-bind:src="this.image" alt="sunil">
    </div>
    <div class="received_msg">
      <div class="received_withd_msg">
        <p>
          {{ messageText }}
        </p>
        <span class="time_date">11:01 AM | June 9</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ReceiveMessage',
  data: () => {
    return {
      messageText: 'hello world',
      username: 'Chuck Norris',
      image: 'https://ptetutorials.com/images/user-profile.png'
    }
  },
  props: ['user', 'message'],
  mounted () {
    if (this.message !== undefined) this.messageText = this.message
    if (this.user !== undefined) this.username = this.user.username
    if (this.user !== undefined) this.image = this.user.image
  }
}
</script>
<style scoped>
img {
  max-width:100%;
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
