<template>
  <b-row class="justify-content-center" id="match-btn">
    <b-col class="text-right">
      <b-button class="rounded-circle" variant="outline-danger" v-on:click="like">
        <font-awesome-icon :icon="['far', 'heart']"/>
      </b-button>
    </b-col>
    <b-col class="text-left">
      <b-button class="rounded-circle" variant="outline-warning" v-on:click="block">
        <font-awesome-icon :icon="['fas', 'times']"/>
      </b-button>
    </b-col>
  </b-row>
</template>
<script>
import User from '@/services/User'
export default {
  name: 'MatchButton',
  props: {
    'id': {
      type: [String, Number],
      required: true
    },
    col: Boolean,
    socket: Object
  },
  methods: {
    like () {
      console.log(this.socket)
      const notification = { receiver: this.id, emitter: User.getID(), type: 'like' }
      this.socket.emit('notification', notification)
      // this.$emit('like', this.id)
    },
    block () {
      this.$emit('block', this.id)
    }
  }
}
</script>
<style>
#match-btn .text-left .rounded-circle:hover {
  color: white;
}
</style>
