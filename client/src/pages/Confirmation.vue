<template>
  <b-container fluid class="h-100">
    <b-row class="justify-content-md-center">
      <b-col col md="6" lg="6">
        <b-card title="Waiting confirmation of your account" sub-title="" class="bg-dark-transparent">
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
              Your account is now verified !
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
    User.confirmAccount({ 'token': token })
      .then(success => {
        this.confirmed = true
        router.push('/login')
      })
      .catch((err) => {
        this.confirmed = 'error'
        this.errorMessage = err.response.data.err
      })
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
