<template>
    <b-card
      class="size-max-md"
      v-bind:title="person.fullname"
      v-bind:subTitle="person.age.toString()"
      v-bind:img-src="profilePic"
      img-fluid
      img-alt="image"
      img-top
  >
      <p class="card-text" >
        <b-button v-bind:href="profilePath">View profile</b-button>
        <b-badge v-if="person.isOnline === true" variant="success">Online</b-badge>
        <b-badge v-else >{{ person.last_connection }}</b-badge>
      </p>
      <div class="d-flex justify-content-around flex-wrap mb-2">
        <b-badge
          class="mb-2"
          v-for="interest in interests"
          v-bind:key="interest"
          v-bind:variant="`${colors[parseInt((Math.random().toFixed(2) * 100)) % colors.length]}`"
        >
        {{ interest }}
        </b-badge>
      </div>
      <v-btn
        v-bind:id="person.id"
        v-on:like="like"
        v-bind:socket="socket"
        v-on:block="block"
      />
  </b-card>
</template>

<script>
import MatchButton from '@/components/MatchButton'
export default {
  name: 'MultiMatch',
  components: {
    'v-btn': MatchButton
  },
  props: ['person', 'socket'],
  data () {
    return {
      interests: [],
      colors: [
        'primary',
        'secondary',
        'info'
      ]
    }
  },
  beforeMount () {
    this.interests = this.person.interests.slice(0, 5)
  },
  computed: {
    profilePath () {
      return '/Profile/' + this.person.id
    },
    profilePic () {
      return 'http://localhost:8081/assets/' + this.person.profilePic
    }
  },
  methods: {
    like (personId) {
      this.$emit('like', personId)
    },
    block (personId) {
      this.$emit('block', personId)
    }
  }
}
</script>
<style scoped>
.rounded-circle {
  height: 50px;
  width: 50px;
  font-size: 22px;
  padding: 0;
  margin: 0;
}
.btn-outline-warning:hover {
  color:white;
}
.size-max-md {
  max-width: 20rem;
}
</style>
