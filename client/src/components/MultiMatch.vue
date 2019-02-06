<template>
    <b-card
      v-bind:title="person.fullname"
      v-bind:subTitle="person.age.toString()"
      img-src="https://randomuser.me/api/portraits/women/65.jpg"
      img-fluid
      img-alt="image"
      img-top
  >
      <p class="card-text" ><b-button v-bind:href="profilePath">View profile</b-button></p>
      <p class="card-text" >{{ person.interests }}</p>
      <v-btn
        v-bind:id="person.id"
        v-on:like="like"
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
  props: ['person'],
  data () {
    return { }
  },
  computed: {
    profilePath: function () {
      return '/Profile/' + this.person.id
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
</style>
