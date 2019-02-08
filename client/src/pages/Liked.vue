<template>
  <b-container fluid class="h-100">
    <b-row class="justify-content-md-center">
      <b-col md="12">
        <b-card title="About us" sub-title="" class="bg-dark-transparent">
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import User from '@/services/User'
import _ from 'lodash'
export default {
  name: 'Liked',
  data () {
    return {
      user: [],
      userLiked: []
    }
  },
  beforeMount () {
    User.get()
      .then(success => {
        this.user = success.data.user
        const liked = this.user.likes
        let promises = []
        _.each(liked, x => {
          promises.push(User.get(x.id))
        })
        Promise.all(promises)
          .then(success => {
            this.userLiked = success
            console.dir(success)
          })
      })
      .catch(err => console.dir(err))
  }
}
</script>
<style scoped>
.bg-dark-transparent {
  background-color:#343a40ad;
  color:rgba(255, 255, 255, 0.8);
  height: 100%;
}
#a {
  flex: 1 100%;
}
#b {
  flex: 1 100%;
}
</style>
