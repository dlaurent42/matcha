<template>
  <div class="outgoing_msg">
    <div class="sent_msg">
        <p>{{ messageText }} </p>
      <span class="time_date">{{ this.date }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SentMessage',
  data: () => {
    return {
      messageText: 'hello world',
      date: 'Today'
    }
  },
  props: ['user', 'message'],
  mounted () {
    if (this.message !== undefined) this.messageText = this.message.text
    if (this.message !== undefined) this.date = this.message.date
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
  margin:26px 0 26px;
}
.sent_msg {
  float: right;
  width: 46%;
}
</style>
