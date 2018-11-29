<template>
  <div class="index">
    Hello world, there are currently {{ userCount }} users
  </div>
</template>
<script>
import Index from '@/services/Index'
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
      const response = await Index.fetch()
      this.userCount = response.data.userCount
    }
  }
}
</script>
<style type="text/css">
</style>
