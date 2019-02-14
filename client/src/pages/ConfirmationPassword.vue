<template>
  <b-container fluid class="h-100">
    <b-row class="justify-content-md-center">
      <b-col col md="6" lg="6">
        <b-card title="Enter a new password" class="bg-dark-transparent">
          <div class="card-text" >
            <b-form-group
              id="exampleInputGroup2"
              label-for="exampleInput2"
            >
              <b-form-input
                id="exampleInput2"
                type="password"
                :state="verifyPassword"
                v-model="input.password"
                required
                placeholder="Enter password"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="exampleInputGroup3"
              label-for="exampleInput3"
            >
              <b-form-input
                id="exampleInput3"
                type="password"
                :state="verifycPassword"
                v-model="input.cpassword"
                required
                placeholder="Re-enter password"
              ></b-form-input>
            </b-form-group>
            <v-load
              v-if="verifycPassword && verifyPassword"
              v-bind:loadingState="loadingPassword"
              v-on:update="confirmPassword"
            />
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import User from '@/services/User'
import buttonLoading from '@/components/buttonLoading'
import isPassword from '@/utils/user/isPassword'
import _ from 'lodash'
import router from '@/router'
export default {
  data () {
    return {
      loadingPassword: 'false',
      confirmed: false,
      errorMessage: '',
      input: {
        password: '',
        cpassword: ''
      }
    }
  },
  components: {
    'v-load': buttonLoading
  },
  methods: {
    confirmPassword () {
      const query = this.$router.history.current.query
      const token = _.isEmpty(query) ? null : query.token
      User.confirmPassword(token, this.input.password, this.input.cpassword)
        .then(success => {
          this.confirmed = true
          router.push('/login')
        })
        .catch((err) => {
          this.confirmed = 'error'
          this.errorMessage = err.response.data.err
        })
    }
  },
  computed: {
    verifyPassword () { return this.input.password === '' ? null : isPassword(this.input.password) },
    verifycPassword () { return this.input.password === '' ? null : this.input.cpassword === this.input.password }
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
