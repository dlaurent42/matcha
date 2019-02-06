<template>
  <b-dropdown-item class="custom-hover" disabled>
    <img v-bind:src="current.path" alt>
    <router-link
      :to="getPath"
    >
      {{ current.username }}
    </router-link>
    {{ getMessage }}
    <b-badge
      @click="suppress($event)"
      variant="dark"
    >
        <font-awesome-icon :icon="['fas', 'times']" size="1x"/>
    </b-badge>
  </b-dropdown-item>
</template>

<script>
export default {
  name: 'Notification',
  props: ['notification'],
  data () {
    return {
      current: '',
      type: new Map([
        ['like', 'likes your profile'],
        ['message', 'sent you a message'],
        ['view', 'has seen your profile'],
        ['profile', 'has seen your profile'],
        ['unlike', 'no longer likes your profile']
      ])
    }
  },
  methods: {
    suppress (event) { this.$emit('suppress', this.notification) },
    prevent (event) { if (event) event.preventDefault() }
  },
  beforeMount () { this.current = this.notification[0] },
  computed: {
    getPath () { return '/Profile/' + this.current.id },
    getMessage () { return this.type.get(this.current.type) }
  }
}
</script>
<style scoped>
.custom-hover:hover {
  background-color: #007290;
  color:skyblue;
}
.custom-hover:hover a {
  color: white;
}
</style>
