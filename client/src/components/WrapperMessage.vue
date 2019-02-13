<template >
  <div>
      <v-sent
        v-if="this.logic === true"
        v-bind:message="message"
        v-bind:user="user"
        v-bind:last="last"
      />
      <v-receive
        v-else-if="this.logic !== null"
        v-bind:message="message"
        v-bind:user="user"
        v-bind:last="last"
      />
  </div>
</template>

<script>
import SentMessage from '@/components/SentMessage'
import ReceiveMessage from '@/components/ReceiveMessage'
import User from '@/services/User'
export default {
  components: {
    'v-sent': SentMessage,
    'v-receive': ReceiveMessage
  },
  data () {
    return {
      logic: null
    }
  },
  props: ['user', 'message', 'last'],
  beforeMount () {
    User.getID()
      .then(success => { this.logic = success === this.message.emitter_id })
      .catch(err => { this.logic = err })
  }
}
</script>
