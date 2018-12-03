<template>
  <div class="index">
    Hello world, there are currently {{ userCount }} users
  </div>
</template>
<script>
import User from '@/services/User'
export default {
  name: 'index',
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
