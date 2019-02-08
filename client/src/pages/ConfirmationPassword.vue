<template>
  <b-container fluid class="h-100">
    <b-row class="justify-content-md-center">
      <b-col col md="6" lg="6">
        <b-card title="Waiting confirmation of your token" sub-title="" class="bg-dark-transparent">
          <p
            class="card-text"
            v-if="confirmed === false"
          >
            <font-awesome-icon icon="spinner" size="1x" pulse/> Updating...
          </p>
          <template v-else-if="confirmed === 'error'">
            <p class="card-text text-danger" >
              {{ errorMessage }} Please contact an admin
            </p>
          </template>
          <template v-else>
            <p class="card-text" >
              Your password is now reset !
              Redirection in <span id="displayCount"></span>...
            </p>
            <router-link to="/login" class="nav-link">Or click here to log in</router-link>
          </template>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import User from '@/services/User'
import _ from 'lodash'
import router from '@/router'
export default {
  data () {
    return {
      confirmed: false,
      errorMessage: ''
    }
  },
  mounted () {
    const query = this.$router.history.current.query
    const token = _.isEmpty(query) ? null : query.token
    console.log(token)
    User.confirmPassword(token)
      .then(success => {
        console.dir(success)
        this.confirmed = true
        this.countDown(() => { router.push('login') })
      })
      .catch((err) => {
        console.dir(err)
        this.confirmed = 'error'
        this.errorMessage = err.response.data.err
      })
  },
  methods: {
    countDown (callback) {
      let i = 5
      let myinterval = setInterval(() => {
        document.getElementById('displayCount').innerHTML = i
        if (i === 0) {
          clearInterval(myinterval)
          callback()
        } else i--
      }, 1000)
    }
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
