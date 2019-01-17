<template>
  <div class="chat_list active_chat">
    <div class="chat_people">
      <div class="chat_img">
        <img v-bind:src="user.img">
      </div>
      <div class="chat_ib">
        <h5> {{ user.firstname }} {{ user.lastname }}
          <span class="chat_date">{{ message.date }}</span>
        </h5>
        <p>
          {{ message.content }}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'lastMessage',
  props: ['user', 'message'],
  data () {
    return {}
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
