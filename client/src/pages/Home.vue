<template>
  <div class="Home">
    Hello world, there are currently {{ userCount }} users
    <v-carousel></v-carousel>
  </div>
</template>
<script>
import User from '@/services/User'
import Carousel from '@/components/Carousel'

export default {
  name: 'Home',
  components: {
    'v-carousel': Carousel
  },
  data () {
    return {
      userCount: 0
    }
  },
  mounted () {
    this.countUsers()
  },
  methods: {
    async countUsers () {
      const response = await User.count()
      this.userCount = response.data.userCount
    }
  }
}
</script>
<style type="text/css">
</style>
